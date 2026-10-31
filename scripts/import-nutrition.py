"""Build the calorie catalogue from the pinned, public-domain USDA SR Legacy CSV archive.
Usage: python scripts/import-nutrition.py /path/to/FoodData_Central_sr_legacy_food_csv_2018-04.zip
No API key, live nutrition lookup, or third-party Python packages are needed.
"""
import csv, hashlib, io, json, math, pathlib, re, sys, zipfile
ROOT=pathlib.Path(__file__).resolve().parent.parent
EXPECTED='b80817294b8850530aaedf2e515c02593b1824f763a0ff356e5c2081643e6fd0'
p=pathlib.Path(sys.argv[1]);assert hashlib.sha256(p.read_bytes()).hexdigest()==EXPECTED,'Unexpected USDA archive; review provenance before importing'
curated=json.loads((ROOT/'data/nutrition/persian-foods.json').read_text())
GROUPS={'1':'dairy','2':'other','3':'other','4':'fats','5':'protein','6':'meals','7':'protein','8':'grains','9':'fruits','10':'protein','11':'vegetables','12':'nuts','13':'protein','14':'drinks','15':'protein','16':'legumes','17':'protein','18':'grains','19':'sweets','20':'grains','21':'meals','22':'meals','23':'sweets','24':'other','25':'meals','26':'other','27':'other','28':'drinks'}
WORDS={'cup':'پیمانهٔ استاندارد','tbsp':'قاشق غذاخوری سرصاف','tablespoon':'قاشق غذاخوری سرصاف','tablespoons':'قاشق غذاخوری سرصاف','tsp':'قاشق چای‌خوری سرصاف','teaspoon':'قاشق چای‌خوری سرصاف','large':'عدد بزرگ','medium':'عدد متوسط','small':'عدد کوچک','slice':'برش','slices':'برش','oz':'اونس','fl oz':'اونس مایع','fruit':'عدد میوه','date, pitted':'عدد، بدون هسته','clove':'حبه','leaf':'برگ','apricot':'عدد زردآلو','cucumber':'عدد خیار','pita':'عدد نان پیتا','chopped':'خردشده','sliced':'ورقه‌شده','halves':'نیمه','diced':'نگینی','crumbled':'خردشده','whole':'کامل','mashed':'له‌شده','pieces':'تکه','packed':'فشرده','unpacked':'غیرفشرده','without skin':'بدون پوست','pitted':'بدون هسته','serving':'سهم مرجع','almond':'عدد بادام','kernel':'عدد مغز','cherry':'عدد گیلاس','grape':'عدد انگور'}
def canonical_modifier(s):
 return re.sub(r'^tablespoons?\b','tbsp',re.sub(r'^teaspoons?\b','tsp',s))
def label(s):
 if s in WORDS:return WORDS[s]
 # Leave descriptions that cannot be translated faithfully in their source language.
 parts=[x.strip() for x in s.split(',')]
 if all(x in WORDS for x in parts):return '، '.join(WORDS[x] for x in parts)
 if s.startswith('oz '):return 'اونس ('+s[3:]+')'
 return s
with zipfile.ZipFile(p) as z:
 prefix=next(n.rsplit('/',1)[0] for n in z.namelist() if n.endswith('/food.csv'))
 def rows(name):return csv.DictReader(io.TextIOWrapper(z.open(prefix+'/'+name),encoding='utf-8-sig'))
 energy={r['fdc_id']:float(r['amount']) for r in rows('food_nutrient.csv') if r['nutrient_id']=='1008' and r['amount']!=''}
 portions={}
 for r in rows('food_portion.csv'):
  try:g=float(r['gram_weight'])/float(r['amount'])
  except (ValueError,ZeroDivisionError):continue
  if not math.isfinite(g) or g<=0:continue
  modifier=r['modifier'].strip()
  portions.setdefault(r['fdc_id'],[]).append({'id':'usda-'+r['id'],'label':label(modifier),'grams':round(g,6),'basis':'usda','original':modifier})
 foods=[]
 for r in rows('food.csv'):
  fid=r['fdc_id'];k=energy.get(fid)
  if k is None or not math.isfinite(k) or not 0<=k<=1000:continue
  c=curated.get(fid,{});units=portions.get(fid,[])
  cup=next((u for u in units if re.match(r'^cup(?:,|$)',u['original']) and not any(term in u['original'] for term in ['yield','dry','uncooked','cooked','prepared'])),None)
  tbsp=next((u for u in units if canonical_modifier(u['original'])=='tbsp'),None)
  if not tbsp and cup:
   tbsp={'id':'tbsp-derived','label':'قاشق غذاخوری سرصاف'+('، خردشده' if any(x in cup['original'] for x in ['chopped','diced','sliced']) else ''),'grams':round(cup['grams']/16,6),'basis':'cup/16','original':'tbsp-derived'};units.append(tbsp)
  if tbsp and not any(canonical_modifier(u['original'])=='tsp' for u in units) and r['food_category_id'] in ['2','4','19']:
   units.append({'id':'tsp-derived','label':'قاشق چای‌خوری سرصاف','grams':round(tbsp['grams']/3,6),'basis':'tbsp/3','original':'tsp-derived'})
  grams={'id':'gram','label':'گرم','grams':1,'basis':'weight','original':'gram'};units=[grams]+units
  default=next((u['id'] for u in units if canonical_modifier(u['original']).startswith(c.get('defaultModifier','gram'))),'gram')
  food={'id':fid,'name':c.get('name',r['description']),'originalName':r['description'],'category':'protein' if r['description'].lower().startswith('egg,') else GROUPS.get(r['food_category_id'],'other'),'kcal100g':k,'portions':units,'defaultPortion':default,'localized':bool(c)}
  if c.get('aliases'):food['aliases']=c['aliases']
  if fid in ['168878','169704']:food['note']='برنج ساده است؛ روغن، کره و افزودنی‌ها را جدا ثبت کنید.'
  if fid=='173424':food['note']='وزن بخش خوراکی، بدون پوستهٔ تخم‌مرغ است.'
  foods.append(food)
 # Match the curated order so common foods appear before the extended catalogue.
 rank={fid:i for i,fid in enumerate(curated)};foods.sort(key=lambda f:(rank.get(f['id'],100000),f['originalName']))
 missing=set(curated)-{f['id'] for f in foods};assert not missing,missing
 out=ROOT/'data/nutrition';out.mkdir(parents=True,exist_ok=True)
 (out/'foods.json').write_text(json.dumps(foods,ensure_ascii=False,separators=(',',':')))
 manifest={'source':'USDA FoodData Central — SR Legacy','release':'April 2018 (final SR Legacy release)','published':'2019-04-01','retrieved':'2026-10-31','sourceUrl':'https://fdc.nal.usda.gov/download-datasets/','archiveUrl':'https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_sr_legacy_food_csv_2018-04.zip','archiveSha256':EXPECTED,'license':'CC0-1.0','licenseUrl':'https://creativecommons.org/publicdomain/zero/1.0/','records':len(foods),'localized':sum(f['localized'] for f in foods),'excludedMissingEnergy':7793-len(foods),'energyNutrientId':1008,'energyUnit':'kcal per 100 g edible portion','portionRule':'Source gram_weight / source amount; tablespoon derived as cup/16 only if a source cup exists. Teaspoon derived as tablespoon/3 for fats, spices and sweets. Gram basis always available.'}
 (out/'source.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
 public=ROOT/'public/data';public.mkdir(exist_ok=True)
 with (public/'calorie-foods.csv').open('w',newline='',encoding='utf-8-sig') as h:
  writer=csv.writer(h);writer.writerow(['FDC ID','نام فارسی یا نام اصلی','Original USDA name','kcal / 100 g','Category','Household portions (grams)','Source URL'])
  for f in foods:writer.writerow([f['id'],f['name'],f['originalName'],f['kcal100g'],f['category'],'; '.join(u['label']+' = '+str(u['grams']) for u in f['portions']),'https://fdc.nal.usda.gov/food-details/'+f['id']+'/nutrients'])
 print(json.dumps(manifest,ensure_ascii=False,indent=2))
 print('Catalogue bytes:',(out/'foods.json').stat().st_size)

# Read-only SEO smoke audit: python scripts/audit-seo.py [base-url] [report.json]
# Uses only Python's standard library. Does not submit or modify any records.
import json,urllib.request,urllib.error,xml.etree.ElementTree as ET
from html.parser import HTMLParser
import sys
ORIGIN='https://doctorreson.ir';BASE=(sys.argv[1] if len(sys.argv)>1 else ORIGIN).rstrip('/')
class Page(HTMLParser):
 def __init__(self):super().__init__();self.title='';self.intitle=False;self.h1=0;self.meta={};self.canonical=[];self.links=[];self.ids=set();self.schemas=[];self.ld=False;self.buffer='';self.images=[]
 def handle_starttag(self,t,attrs):
  a=dict(attrs)
  if a.get('id'):self.ids.add(a['id'])
  if t=='title':self.intitle=True
  if t=='h1':self.h1+=1
  if t=='meta':self.meta.setdefault(a.get('name',a.get('property','')),[]).append(a.get('content'))
  if t=='link' and a.get('rel')=='canonical':self.canonical.append(a['href'])
  if t=='a':self.links.append(a.get('href',''))
  if t=='img':self.images.append(a)
  if t=='script' and a.get('type')=='application/ld+json':self.ld=True;self.buffer=''
 def handle_endtag(self,t):
  if t=='title':self.intitle=False
  if t=='script' and self.ld:self.schemas.append(json.loads(self.buffer));self.ld=False
 def handle_data(self,s):
  if self.intitle:self.title+=s
  if self.ld:self.buffer+=s

def get(path):
 req=urllib.request.Request(BASE+path,headers={'User-Agent':'Mozilla/5.0'})
 try:r=urllib.request.urlopen(req,timeout=25)
 except urllib.error.HTTPError as e:r=e
 return r.status,r.headers,r.read().decode(errors='replace')
s,h,b=get('/sitemap.xml');assert s==200
locations=[x.text for x in ET.fromstring(b).findall('{*}url/{*}loc')];assert len(locations)==10 and len(set(locations))==10
assert all(x.startswith(ORIGIN+'/') for x in locations),locations
paths=[x.removeprefix(ORIGIN) for x in locations]
report=[];pages={};titles=set();descriptions=set();internal=set();fragments=[]
for path in paths:
 s,h,b=get(path);assert s==200,(path,s);p=Page();p.feed(b);pages[path]=p
 assert p.h1==1 and len(p.canonical)==1,(path,p.h1,p.canonical)
 assert p.canonical[0].rstrip('/')==(ORIGIN+path).rstrip('/'),(path,p.canonical)
 assert len(p.meta.get('description',[]))==1
 assert p.title not in titles and p.meta['description'][0] not in descriptions
 titles.add(p.title);descriptions.add(p.meta['description'][0])
 assert p.meta.get('robots') and all('noindex' not in x for x in p.meta['robots'])
 assert len(p.schemas)==1,path
 assert 'doctor-resoon.cometolive34.chatgpt.site' not in b,path
 for key in ['og:url','og:image','twitter:image']:
  assert p.meta.get(key) and all(x==ORIGIN or x.startswith(ORIGIN+'/') for x in p.meta[key]),(path,key)
 graph=p.schemas[0]['@graph'];node_ids={x['@id'] for x in graph};assert len(node_ids)==len(graph)
 refs=[]
 def walk(x):
  if isinstance(x,dict):
   if len(x)==1 and '@id' in x:refs.append(x['@id'])
   for v in x.values():walk(v)
  elif isinstance(x,list):
   for v in x:walk(v)
 walk(graph);assert all(x in node_ids for x in refs),(path,refs)
 for image in p.images:assert image.get('alt') and image.get('width') and image.get('height') and 'srcset' in image
 for href in p.links:
  if href.startswith(('/', '#')):
   from urllib.parse import urlsplit
   parts=urlsplit(href);target=parts.path or path
   internal.add(target)
   if parts.fragment:fragments.append((target,parts.fragment,path))
 report.append({'path':path,'status':s,'title':p.title,'descriptionLength':len(p.meta['description'][0]),'canonical':p.canonical[0],'schemaTypes':[x['@type'] for x in graph]})
for target in internal:
 if target not in pages:
  s,_,_=get(target);assert s==200,(target,s)
for target,fragment,source in fragments:
 if target in pages:assert fragment in pages[target].ids,(source,target,fragment)
for path in ['/missing-seo-page','/services/not-a-service']:
 s,h,b=get(path);assert s==404 and 'noindex' in b
s,h,b=get('/robots.txt');assert s==200 and ORIGIN+'/sitemap.xml' in b and 'Disallow: /\n' not in b and 'Disallow: /api/' in b
s,h,b=get('/google5b4ed26796eb34ea.html');assert s==200 and b=='google-site-verification: google5b4ed26796eb34ea.html\n' and 'noindex' in h.get('X-Robots-Tag','')
print(json.dumps({'pages':len(report),'uniqueTitles':len(titles),'internalTargets':len(internal),'fragments':len(fragments),'status':'passed'}))
open(sys.argv[2] if len(sys.argv)>2 else '/tmp/doctor-resoon-seo-audit.json','w').write(json.dumps(report,ensure_ascii=False,indent=2))

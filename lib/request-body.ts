type JsonBody = { data: unknown; error?: never; status?: never } | { error: string; status: 400 | 413 | 415; data?: never };

// Bound the buffered text, then drain rejected bodies for safe HTTP connection reuse.
export async function readJsonBody(request: Request, limit: number): Promise<JsonBody> {
  const contentType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
  if (contentType !== "application/json") return { error: "نوع داده معتبر نیست.", status: 415 };
  const declaredLength = Number(request.headers.get("content-length"));
  if (!request.body) return { error: "اطلاعات فرم قابل خواندن نیست.", status: 400 };

  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let size = 0;
  let text = "";
  let oversized = Number.isFinite(declaredLength) && declaredLength > limit;
  let invalidEncoding = false;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) oversized = true;
      if (!oversized && !invalidEncoding) {
        try { text += decoder.decode(value, { stream: true }); }
        catch { invalidEncoding = true; }
      }
    }
    if (oversized) return { error: "حجم اطلاعات بیش از حد مجاز است.", status: 413 };
    if (invalidEncoding) return { error: "اطلاعات فرم قابل خواندن نیست.", status: 400 };
    text += decoder.decode();
    return { data: JSON.parse(text) };
  } catch {
    return { error: "اطلاعات فرم قابل خواندن نیست.", status: 400 };
  } finally {
    reader.releaseLock();
  }
}

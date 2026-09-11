/**
 * IndexNow key file (brief §19). The IndexNow protocol verifies ownership
 * by fetching a text file on the host that contains exactly the submitted
 * key; submissions reference this path via `keyLocation`. Serving it from
 * the INDEXNOW_KEY env var keeps the key out of the repository. 404s until
 * the key is configured, which simply means IndexNow is not active yet.
 */
export function GET(): Response {
  const key = process.env.INDEXNOW_KEY;
  if (!key) return new Response("Not found", { status: 404 });
  return new Response(key, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export const dynamic = "force-dynamic";

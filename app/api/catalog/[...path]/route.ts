import { catalogBackendUrl } from '../../../catalog-server';

export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const allowed = (path.length === 1 && ['facets', 'products'].includes(path[0]))
    || (path.length === 2 && path[0] === 'products' && /^[a-z0-9-]{1,100}$/.test(path[1]))
    || (path.length === 2 && path[0] === 'images' && /^[a-f0-9]{64}\.(jpg|png|webp|gif)$/.test(path[1]));
  if (!allowed) return Response.json({ message: 'Not found' }, { status: 404 });
  try {
    const url = new URL(catalogBackendUrl(path.join('/')));
    if (path.length === 1 && path[0] === 'products') {
      const query = new URL(request.url).searchParams;
      for (const key of ['brand', 'collection', 'silhouette', 'q', 'page', 'limit']) {
        const values = query.getAll(key);
        if (values.length > 1) return Response.json({ message: 'Invalid query' }, { status: 400 });
        if (values[0]) url.searchParams.set(key, values[0]);
      }
    }
    const upstream = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(15000) });
    if (!upstream.ok) return Response.json({ message: upstream.status === 404 ? 'Not found' : 'Catalog request failed' }, { status: upstream.status >= 500 ? 503 : upstream.status });
    const headers = new Headers();
    for (const key of ['content-type', 'content-length', 'cache-control', 'x-content-type-options']) {
      const value = upstream.headers.get(key);
      if (value) headers.set(key, value);
    }
    return new Response(upstream.body, { status: 200, headers });
  } catch (error) {
    const cause = error instanceof Error ? (error as Error & { cause?: { code?: unknown } }).cause : undefined;
    const knownCodes = ['ECONNREFUSED', 'ENOTFOUND', 'EAI_AGAIN', 'ETIMEDOUT', 'UND_ERR_CONNECT_TIMEOUT', 'CERT_HAS_EXPIRED', 'UNABLE_TO_VERIFY_LEAF_SIGNATURE', 'DEPTH_ZERO_SELF_SIGNED_CERT', 'ERR_TLS_CERT_ALTNAME_INVALID'];
    const code = typeof cause?.code === 'string' && knownCodes.includes(cause.code)
      ? cause.code : error instanceof TypeError && error.message === 'Invalid URL' ? 'INVALID_BACKEND_URL'
      : error instanceof Error && error.name === 'TimeoutError' ? 'BACKEND_TIMEOUT' : 'BACKEND_FETCH_FAILED';
    let target = 'invalid';
    try { target = new URL(catalogBackendUrl('')).hostname; } catch {}
    console.error('Catalog backend connection failed', { code, target, configured: Boolean(process.env.BACKEND_URL) });
    return Response.json({ message: 'Catalog is temporarily unavailable' }, {
      status: 503,
      headers: { 'Cache-Control': 'no-store', 'X-Atelier-Backend-Error': code, 'X-Atelier-Backend-Configured': process.env.BACKEND_URL ? 'yes' : 'no' },
    });
  }
}

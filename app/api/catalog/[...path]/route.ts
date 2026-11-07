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
  } catch {
    return Response.json({ message: 'Catalog is temporarily unavailable' }, { status: 503 });
  }
}

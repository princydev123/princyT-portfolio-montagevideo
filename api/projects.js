// Liste des projets, stockée dans un fichier JSON sur Vercel Blob.
// GET : public. PUT : réservé à l’admin (remplace toute la liste).
import { put, list, del } from "@vercel/blob";
import { isAuthed } from "../lib/auth.js";

const KEY = "data/projects.json";
const s = (v, n) => String(v ?? "").trim().slice(0, n);
const httpUrl = (v) => { const u = s(v, 600); return /^https?:\/\//i.test(u) ? u : ""; };
const clean = (p) => ({
  id: s(p.id, 40) || Math.random().toString(36).slice(2, 10),
  brand: s(p.brand, 80), tag: s(p.tag, 40), hook: s(p.hook, 80),
  desc: s(p.desc, 200), dur: s(p.dur, 10), url: httpUrl(p.url), video: httpUrl(p.video), poster: httpUrl(p.poster)
});

let blobUrl = "";
async function readAll() {
  if (!blobUrl) { // une seule requête list() par instance (l’URL ne change jamais)
    const { blobs } = await list({ prefix: KEY, limit: 5 });
    const b = blobs.find((x) => x.pathname === KEY);
    if (!b) return [];
    blobUrl = b.url;
  }
  const r = await fetch(blobUrl + "?t=" + Date.now(), { cache: "no-store" });
  if (!r.ok) return [];
  try { const d = await r.json(); return Array.isArray(d) ? d : []; } catch { return []; }
}

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      res.setHeader("Cache-Control", "public, max-age=10, s-maxage=30, stale-while-revalidate=86400");
      return res.status(200).json(await readAll());
    }
    res.setHeader("Cache-Control", "no-store");
    if (req.method === "PUT") {
      if (!isAuthed(req)) return res.status(401).json({ error: "Non autorisé" });
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      if (!Array.isArray(body) || body.length > 200) return res.status(400).json({ error: "Données invalides" });
      const next = body.map(clean).filter((p) => p.brand);
      const old = await readAll();
      await put(KEY, JSON.stringify(next), {
        access: "public", addRandomSuffix: false, allowOverwrite: true,
        contentType: "application/json", cacheControlMaxAge: 60
      });
      // supprime du stockage les vidéos qui ne sont plus utilisées
      const keep = new Set(next.flatMap((p) => [p.video, p.poster]).filter(Boolean));
      const gone = old.flatMap((p) => [p.video, p.poster]).filter((v) => v && !keep.has(v) && v.includes(".blob.vercel-storage.com"));
      if (gone.length) await del(gone);
      return res.status(200).json(next);
    }
    res.setHeader("Allow", "GET, PUT");
    return res.status(405).json({ error: "Méthode non autorisée" });
  } catch (e) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
}

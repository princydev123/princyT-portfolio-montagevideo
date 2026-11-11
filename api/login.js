import { checkPassword, makeCookie, clearCookie, isAuthed } from "../lib/auth.js";

const parse = (b) => { try { return typeof b === "string" ? JSON.parse(b) : (b || {}); } catch { return {}; } };

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "GET") {
    return isAuthed(req) ? res.status(200).json({ ok: true }) : res.status(401).json({ ok: false });
  }
  if (req.method === "DELETE") {
    res.setHeader("Set-Cookie", clearCookie());
    return res.status(200).json({ ok: true });
  }
  if (req.method === "POST") {
    if (!checkPassword(parse(req.body).password)) {
      await new Promise((r) => setTimeout(r, 700)); // ralentit les essais au hasard
      return res.status(401).json({ ok: false });
    }
    res.setHeader("Set-Cookie", makeCookie());
    return res.status(200).json({ ok: true });
  }
  res.setHeader("Allow", "GET, POST, DELETE");
  return res.status(405).json({ error: "Méthode non autorisée" });
}

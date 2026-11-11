import crypto from "node:crypto";

const secret = () => process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
const mac = (v) => crypto.createHmac("sha256", secret()).update(v).digest("hex");

export function checkPassword(p) {
  const a = Buffer.from(String(p || ""));
  const b = Buffer.from(process.env.ADMIN_PASSWORD || "");
  return b.length > 0 && a.length === b.length && crypto.timingSafeEqual(a, b);
}
export function makeCookie() {
  const exp = String(Date.now() + 7 * 864e5);
  return "adm=" + exp + "." + mac(exp) + "; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800";
}
export function clearCookie() {
  return "adm=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0";
}
export function isAuthed(req) {
  if (!secret()) return false;
  const m = (req.headers.cookie || "").match(/(?:^|;\s*)adm=([^;]+)/);
  if (!m) return false;
  const [exp, sig] = m[1].split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const good = mac(exp);
  return sig.length === good.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good));
}

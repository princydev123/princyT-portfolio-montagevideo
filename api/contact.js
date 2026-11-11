// Reçoit le formulaire de contact et l’envoie par e-mail via Resend.
// Variables d’environnement (Vercel > Settings > Environment Variables) :
//   RESEND_API_KEY : clé API Resend (obligatoire)
//   CONTACT_TO     : adresse qui reçoit les messages (par défaut : zanatohaprincy@gmail.com)

function parse(body) {
  if (typeof body !== "string") return body || {};
  try { return JSON.parse(body); } catch (e) { return {}; }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const b = parse(req.body);
  if (b.website) return res.status(200).json({ ok: true }); // champ piège anti-spam

  const name = String(b.name || "").trim().slice(0, 100);
  const email = String(b.email || "").trim().slice(0, 150);
  const message = String(b.message || "").trim().slice(0, 3000);
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || message.length < 5) {
    return res.status(400).json({ error: "Champs invalides" });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) return res.status(500).json({ error: "Service e-mail non configuré" });
  const to = process.env.CONTACT_TO || "zanatohaprincy@gmail.com";

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Portfolio <onboarding@resend.dev>",
        to: [to],
        reply_to: email,
        subject: "Nouveau message de " + name,
        text: "Nom : " + name + "\nE-mail : " + email + "\n\n" + message
      })
    });
    if (!r.ok) return res.status(502).json({ error: "Envoi impossible" });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ error: "Envoi impossible" });
  }
}

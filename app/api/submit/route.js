export const runtime = "nodejs";
export const maxDuration = 30;

const TO = process.env.NOTIFY_EMAIL || "odunepro@gmail.com";
const FROM = process.env.MAIL_FROM || "Odune <onboarding@resend.dev>";
const MAX_TOTAL = 3.2 * 1024 * 1024; // marge sous la limite de corps de requête Vercel

export async function POST(req) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return Response.json(
      { ok: false, reason: "not_configured" },
      { status: 503 }
    );
  }

  let payload;
  try {
    payload = await req.json();
  } catch (e) {
    return Response.json({ ok: false, reason: "bad_request" }, { status: 400 });
  }

  const { title = "Questionnaire", slug = "cadrage", html = "", files = [] } = payload;

  // Le récapitulatif HTML est toujours joint. Les fichiers ne le sont que
  // s'ils tiennent dans l'enveloppe.
  const attachments = [
    {
      filename: `odune-cadrage-${slug}.html`,
      content: Buffer.from(html, "utf-8").toString("base64"),
    },
  ];

  let total = attachments[0].content.length;
  const dropped = [];

  for (const f of files) {
    const size = (f.content || "").length;
    if (total + size > MAX_TOTAL) {
      dropped.push(f.filename);
      continue;
    }
    attachments.push({ filename: f.filename, content: f.content });
    total += size;
  }

  const when = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
  const body = [
    `<p style="font-family:ui-monospace,Menlo,monospace;font-size:14px;line-height:1.6;color:#261B1A">`,
    `Questionnaire de cadrage rempli et envoyé.<br><br>`,
    `<strong>${title}</strong><br>`,
    `${when}<br><br>`,
    `Le récapitulatif complet est en pièce jointe, au format HTML. `,
    `Ouvrez-le dans un navigateur : réponses, liens, notes et images y sont intégrés.`,
    dropped.length
      ? `<br><br>Fichiers trop lourds pour l'envoi, à réclamer séparément : ${dropped.join(", ")}.`
      : "",
    `</p>`,
  ].join("");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      subject: `Questionnaire de cadrage · ${title}`,
      html: body,
      attachments,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    return Response.json(
      { ok: false, reason: "send_failed", detail: detail.slice(0, 300) },
      { status: 502 }
    );
  }

  return Response.json({ ok: true, dropped });
}

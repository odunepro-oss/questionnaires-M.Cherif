"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const KEY = (slug) => `odune-cadrage-${slug}-v2`;
const MAX_EMBED = 4 * 1024 * 1024; // au-delà, le fichier n'est pas intégré à l'export

const isImage = (f) => (f.type || "").startsWith("image/");
const human = (n) => (n > 1048576 ? `${(n / 1048576).toFixed(1)} Mo` : `${Math.max(1, Math.round(n / 1024))} Ko`);

/* ------------------------------------------------------------------ */
/*  Champ de réponse : hauteur automatique, pas de boîte              */
/* ------------------------------------------------------------------ */
function Grow({ id, value, onChange, placeholder, min = 40, className = "ans", aria }) {
  const ref = useRef(null);

  const grow = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(min, el.scrollHeight)}px`;
  }, [min]);

  useEffect(grow, [grow, value]);

  return (
    <textarea
      ref={ref}
      id={id}
      className={`${className}${value ? " filled" : ""}`}
      aria-label={aria}
      value={value}
      placeholder={placeholder}
      rows={1}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Pièces jointes, liens et notes                                     */
/* ------------------------------------------------------------------ */
function Extras({ gi, label, files, onAdd, onRemove, note, onNote }) {
  const input = useRef(null);
  const [over, setOver] = useState(false);

  const take = (list) => {
    [...list].forEach((f) => {
      const reader = new FileReader();
      reader.onload = () =>
        onAdd({ name: f.name, type: f.type, size: f.size, data: reader.result });
      reader.readAsDataURL(f);
    });
  };

  const drop = async (e) => {
    e.preventDefault();
    setOver(false);
    const items = e.dataTransfer.items;
    if (items && items.length && items[0].webkitGetAsEntry) {
      const out = [];
      const walk = (entry) =>
        new Promise((res) => {
          if (entry.isFile) entry.file((f) => { out.push(f); res(); });
          else if (entry.isDirectory) {
            entry.createReader().readEntries(async (entries) => {
              await Promise.all(entries.map(walk));
              res();
            });
          } else res();
        });
      await Promise.all([...items].map((i) => i.webkitGetAsEntry()).filter(Boolean).map(walk));
      if (out.length) return take(out);
    }
    take(e.dataTransfer.files);
  };

  return (
    <div
      className={`extras${over ? " over" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={drop}
    >
      <p className="xlabel">{label}</p>

      <button type="button" className="attach" onClick={() => input.current?.click()}>
        Joindre un fichier <span>ou déposer ici</span>
      </button>
      <input ref={input} type="file" multiple hidden onChange={(e) => take(e.target.files)} />

      {files.length > 0 && (
        <div className="grid">
          {files.map((f, i) => (
            <figure key={`${f.name}-${i}`} className={isImage(f) ? "img" : "doc"}>
              <button className="kill" type="button" title="Retirer" onClick={() => onRemove(i)}>
                ×
              </button>
              {isImage(f) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.data} alt="" />
              ) : (
                <span className="ext">{(f.name.split(".").pop() || "fichier").slice(0, 5).toUpperCase()}</span>
              )}
              <figcaption>
                {f.name}
                <em>{human(f.size || 0)}</em>
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      <Grow
        id={`note-${gi}`}
        className="note-field"
        aria="Liens ou remarque libre pour ce bloc"
        min={34}
        value={note}
        onChange={onNote}
        placeholder="Un lien par ligne, ou une remarque libre."
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Questionnaire                                                      */
/* ------------------------------------------------------------------ */
export default function Questionnaire({ data }) {
  const total = useMemo(
    () => data.groups.reduce((n, g) => n + g.questions.length, 0),
    [data]
  );

  const [answers, setAnswers] = useState({});
  const [notes, setNotes] = useState({});
  const [files, setFiles] = useState({});
  const [ready, setReady] = useState(false);
  const [saveOk, setSaveOk] = useState(true);
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendErr, setSendErr] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY(data.slug));
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.a) {
          setAnswers(parsed.a || {});
          setNotes(parsed.n || {});
        } else {
          setAnswers(parsed || {});
        }
      }
    } catch (e) {
      setSaveOk(false);
    }
    setReady(true);
  }, [data.slug]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY(data.slug), JSON.stringify({ a: answers, n: notes }));
    } catch (e) {
      setSaveOk(false);
    }
  }, [answers, notes, ready, data.slug]);

  const filled = Object.values(answers).filter((v) => v && v.trim()).length;

  useEffect(() => {
    const guard = (e) => {
      if (!filled || sent) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", guard);
    return () => window.removeEventListener("beforeunload", guard);
  }, [filled, sent]);

  const done = filled;
  const pct = total ? (done / total) * 100 : 0;

  /* --------- export texte --------- */
  const asText = () => {
    let n = 0;
    let out = `ODUNE · QUESTIONNAIRE DE CADRAGE\n${data.title.toUpperCase()}\n${new Date().toLocaleString("fr-FR")}\n`;
    data.groups.forEach((g, gi) => {
      out += `\n\n${g.title.toUpperCase()}\n\n`;
      g.questions.forEach((q) => {
        n += 1;
        out += `${String(n).padStart(2, "0")}. ${q.q}\n${(answers[n] || "(sans réponse)").trim()}\n\n`;
      });
      if (notes[gi] && notes[gi].trim()) out += `Liens et notes :\n${notes[gi].trim()}\n\n`;
      const f = files[gi] || [];
      if (f.length) out += `Fichiers joints : ${f.map((x) => x.name).join(", ")}\n\n`;
    });
    return out;
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(asText());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      setCopied(false);
    }
  };

  /* --------- récapitulatif HTML autonome --------- */
  const buildHtml = () => {
    const esc = (s) =>
      String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const linkify = (s) =>
      esc(s).replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1">$1</a>');

    let n = 0;
    let body = `<h1>${esc(data.title)}</h1><p class="meta">Questionnaire de cadrage Odune · ${new Date().toLocaleString("fr-FR")}</p>`;

    data.groups.forEach((g, gi) => {
      body += `<h2>${esc(g.title)}</h2>`;
      g.questions.forEach((q) => {
        n += 1;
        body += `<p class="q">${String(n).padStart(2, "0")}. ${esc(q.q)}</p><p class="a">${esc(
          (answers[n] || "(sans réponse)").trim()
        )}</p>`;
      });

      if (notes[gi] && notes[gi].trim()) {
        body += `<div class="note"><span>Liens et notes</span><p>${linkify(notes[gi].trim())}</p></div>`;
      }

      (files[gi] || []).forEach((f) => {
        if (isImage(f)) {
          body += `<figure><img src="${f.data}"><figcaption>${esc(f.name)}</figcaption></figure>`;
        } else if ((f.size || 0) <= MAX_EMBED) {
          body += `<p class="file"><a href="${f.data}" download="${esc(f.name)}">${esc(f.name)}</a> <em>${human(
            f.size || 0
          )}</em></p>`;
        } else {
          body += `<p class="file">${esc(f.name)} <em>${human(f.size || 0)} · trop lourd pour être intégré, à envoyer séparément</em></p>`;
        }
      });
    });

    const css =
      "body{font-family:ui-monospace,Menlo,Consolas,monospace;font-weight:300;background:#F9F8F7;color:#261B1A;" +
      "max-width:760px;margin:0 auto;padding:56px 28px;line-height:1.6;font-size:14px;letter-spacing:-.024em}" +
      "h1{font-weight:400;font-size:28px;letter-spacing:-.045em;margin:0 0 6px}" +
      ".meta{color:#635B5A;font-size:12px;margin:0 0 48px}" +
      "h2{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#635B5A;font-weight:400;" +
      "margin:48px 0 22px;border-top:1px solid rgba(38,27,26,.12);padding-top:24px}" +
      ".q{margin:0 0 6px;font-weight:400}.a{margin:0 0 28px;color:#635B5A;white-space:pre-wrap}" +
      ".note{border-left:2px solid rgba(38,27,26,.3);padding:2px 0 2px 14px;margin:0 0 26px}" +
      ".note span{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#635B5A}" +
      ".note p{margin:4px 0 0;white-space:pre-wrap}" +
      ".file{margin:0 0 10px}.file em{color:#635B5A;font-style:normal;font-size:12px}" +
      "a{color:#261B1A}" +
      "figure{margin:0 0 18px;width:230px;display:inline-block;vertical-align:top}" +
      "figure img{width:100%;border:1px solid rgba(38,27,26,.12);border-radius:6px;display:block}" +
      "figcaption{font-size:10.5px;color:#635B5A;padding-top:6px}";

    return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>Odune · ${esc(
      data.title
    )}</title><style>${css}</style></head><body>${body}</body></html>`;
  };

  const exportHtml = () => {
    const url = URL.createObjectURL(new Blob([buildHtml()], { type: "text/html" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `odune-cadrage-${data.slug}.html`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  /* --------- envoi à Odune --------- */
  const send = async () => {
    setSending(true);
    setSendErr("");
    const joined = Object.values(files)
      .flat()
      .map((f) => ({
        filename: f.name,
        content: String(f.data || "").split(",")[1] || "",
      }))
      .filter((f) => f.content);

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          slug: data.slug,
          html: buildHtml(),
          files: joined,
        }),
      });
      const out = await res.json().catch(() => ({}));
      if (res.ok && out.ok) {
        setSent(true);
      } else if (out.reason === "not_configured") {
        setSendErr(
          "L'envoi automatique n'est pas encore activé. Cliquez sur « Exporter les réponses » et envoyez le fichier obtenu à contact@odune.fr."
        );
      } else {
        setSendErr(
          "L'envoi a échoué. Cliquez sur « Exporter les réponses » et envoyez le fichier obtenu à contact@odune.fr."
        );
      }
    } catch (e) {
      setSendErr(
        "L'envoi a échoué, peut-être un problème de connexion. Cliquez sur « Exporter les réponses » et envoyez le fichier obtenu à contact@odune.fr."
      );
    }
    setSending(false);
  };

  let counter = 0;

  return (
    <>
      <div className="rail" aria-hidden="true">
        <i style={{ width: `${pct}%` }} />
      </div>

      <main className="shell">
        <header className="qhead">
          <Link href="/" className="back">
            ← Les deux questionnaires
          </Link>
          <h1>{data.title}</h1>
          {data.lede.map((p, i) => (
            <p className="lede" key={i}>
              {p}
            </p>
          ))}
        </header>

        {data.groups.map((g, gi) => (
          <section className="grp" key={g.title}>
            <div className="side">
              <h3>{g.title}</h3>
              {g.note && <p>{g.note}</p>}
            </div>

            <div>
              {g.questions.map((q) => {
                counter += 1;
                const n = counter;
                return (
                  <div className="q" key={n}>
                    <div className="lbl">
                      <span className="no">{String(n).padStart(2, "0")}</span>
                      <label className="txt" htmlFor={`q${n}`}>
                        {q.q}
                      </label>
                    </div>
                    {q.hint && <p className="hint">{q.hint}</p>}
                    <div className="field">
                      <Grow
                        id={`q${n}`}
                        value={answers[n] || ""}
                        onChange={(v) => setAnswers((a) => ({ ...a, [n]: v }))}
                        placeholder="Votre réponse"
                      />
                    </div>
                  </div>
                );
              })}

              <Extras
                gi={gi}
                label={g.upload || "Un fichier, un lien ou une remarque, si vous en avez."}
                files={files[gi] || []}
                onAdd={(f) => setFiles((s) => ({ ...s, [gi]: [...(s[gi] || []), f] }))}
                onRemove={(i) =>
                  setFiles((s) => ({ ...s, [gi]: (s[gi] || []).filter((_, k) => k !== i) }))
                }
                note={notes[gi] || ""}
                onNote={(v) => setNotes((s) => ({ ...s, [gi]: v }))}
              />
            </div>
          </section>
        ))}

        <section className="end">
          <h3>Quand vous avez terminé</h3>
          <div>
            <p>
              Rien ne nous parvient tant que vous n'avez pas cliqué. Ce bouton nous envoie vos
              réponses, vos liens, vos notes et vos fichiers. Inutile d'avoir tout rempli : ce
              qui manque, nous en parlerons de vive voix.
            </p>
            <button className="send" type="button" onClick={send} disabled={sending || sent}>
              {sent ? "Envoyé, merci" : sending ? "Envoi en cours…" : "Envoyer à Odune"}
            </button>
            {sent && (
              <p className="state">
                Bien reçu. Vous pouvez fermer cette page. Si vous complétez plus tard, renvoyez
                simplement le tout.
              </p>
            )}
            {sendErr && <p className="state bad">{sendErr}</p>}
          </div>
        </section>

        <p className="foot">Odune · Studio-conseil, Paris · contact@odune.fr</p>
      </main>

      <div className="bar">
        <div className="in">
          <span className="count">
            {done} / {total} réponses
          </span>
          <button className="btn" type="button" onClick={copy}>
            {copied ? "Copié" : "Copier le texte"}
          </button>
          <button className="btn" type="button" onClick={exportHtml}>
            Exporter les réponses
          </button>
          <p className="note">
            {saveOk
              ? "Réponses, liens et notes enregistrés automatiquement dans ce navigateur. Les fichiers joints ne le sont pas : envoyez ou exportez avant de fermer."
              : "Enregistrement automatique indisponible dans ce navigateur. Pensez à envoyer avant de fermer."}
          </p>
        </div>
      </div>
    </>
  );
}

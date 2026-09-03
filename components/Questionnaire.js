"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const KEY = (slug) => `odune-cadrage-${slug}-v2`;

/* ------------------------------------------------------------------ */
/*  Champ de réponse : hauteur automatique, pas de boîte              */
/* ------------------------------------------------------------------ */
function Answer({ id, value, onChange }) {
  const ref = useRef(null);

  const grow = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(40, el.scrollHeight)}px`;
  }, []);

  useEffect(grow, [grow, value]);

  return (
    <textarea
      ref={ref}
      id={id}
      className={`ans${value ? " filled" : ""}`}
      value={value}
      placeholder="Votre réponse"
      rows={1}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Zone d'images                                                      */
/* ------------------------------------------------------------------ */
function Upload({ note, files, onAdd, onRemove }) {
  const input = useRef(null);
  const [over, setOver] = useState(false);

  const take = (list) => {
    [...list].forEach((f) => {
      if (!f.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => onAdd({ name: f.name, data: reader.result });
      reader.readAsDataURL(f);
    });
  };

  return (
    <div className="up">
      <button
        type="button"
        className="zone"
        data-over={over ? "1" : "0"}
        onClick={() => input.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); take(e.dataTransfer.files); }}
      >
        {note}
        <span>Cliquer, ou déposer un fichier ici</span>
      </button>
      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => take(e.target.files)}
      />
      {files.length > 0 && (
        <div className="grid">
          {files.map((f, i) => (
            <figure key={`${f.name}-${i}`}>
              <button className="kill" type="button" title="Retirer" onClick={() => onRemove(i)}>
                ×
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.data} alt="" />
              <figcaption>{f.name}</figcaption>
            </figure>
          ))}
        </div>
      )}
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
  const [images, setImages] = useState({});
  const [ready, setReady] = useState(false);
  const [saveOk, setSaveOk] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY(data.slug));
      if (raw) setAnswers(JSON.parse(raw));
    } catch (e) {
      setSaveOk(false);
    }
    setReady(true);
  }, [data.slug]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY(data.slug), JSON.stringify(answers));
    } catch (e) {
      setSaveOk(false);
    }
  }, [answers, ready, data.slug]);

  const done = Object.values(answers).filter((v) => v && v.trim()).length;
  const pct = total ? (done / total) * 100 : 0;

  /* --------- export texte --------- */
  const asText = () => {
    let n = 0;
    let out = `ODUNE · QUESTIONNAIRE DE CADRAGE\n${data.title.toUpperCase()}\n${new Date().toLocaleString("fr-FR")}\n`;
    data.groups.forEach((g) => {
      out += `\n\n${g.title.toUpperCase()}\n\n`;
      g.questions.forEach((q) => {
        n += 1;
        out += `${String(n).padStart(2, "0")}. ${q.q}\n${(answers[n] || "(sans réponse)").trim()}\n\n`;
      });
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

  /* --------- export HTML autonome --------- */
  const exportHtml = () => {
    const esc = (s) =>
      String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
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
      (images[gi] || []).forEach((f) => {
        body += `<figure><img src="${f.data}"><figcaption>${esc(f.name)}</figcaption></figure>`;
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
      "figure{margin:0 0 18px;width:230px;display:inline-block;vertical-align:top}" +
      "figure img{width:100%;border:1px solid rgba(38,27,26,.12);border-radius:6px;display:block}" +
      "figcaption{font-size:10.5px;color:#635B5A;padding-top:6px}";
    const doc = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>Odune · ${esc(
      data.title
    )}</title><style>${css}</style></head><body>${body}</body></html>`;
    const url = URL.createObjectURL(new Blob([doc], { type: "text/html" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `odune-cadrage-${data.slug}.html`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
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
                      <Answer
                        id={`q${n}`}
                        value={answers[n] || ""}
                        onChange={(v) => setAnswers((a) => ({ ...a, [n]: v }))}
                      />
                    </div>
                  </div>
                );
              })}

              {g.upload && (
                <Upload
                  note={g.upload}
                  files={images[gi] || []}
                  onAdd={(f) => setImages((im) => ({ ...im, [gi]: [...(im[gi] || []), f] }))}
                  onRemove={(i) =>
                    setImages((im) => ({ ...im, [gi]: (im[gi] || []).filter((_, k) => k !== i) }))
                  }
                />
              )}
            </div>
          </section>
        ))}

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
          <button className="btn filled" type="button" onClick={exportHtml}>
            Exporter les réponses
          </button>
          <p className="note">
            {saveOk
              ? "Enregistrement automatique dans ce navigateur. Les images ne sont pas enregistrées : exportez-les avant de fermer."
              : "Enregistrement automatique indisponible dans ce navigateur. Pensez à exporter avant de fermer."}
          </p>
        </div>
      </div>
    </>
  );
}

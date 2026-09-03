import Link from "next/link";
import { QUESTIONNAIRES, ORDER, countQuestions } from "@/data/questionnaires";

export default function Home() {
  return (
    <main className="shell">
      <section className="home">
        <p className="kicker">Odune · Questionnaires de cadrage</p>
        <h1 className="display">Avant de proposer, comprendre.</h1>
        <p className="lede">
          Deux projets, deux questionnaires. Chaque question sert à cerner le projet,
          ce qui existe déjà, ce qui coince, et ce que nous pouvons réellement apporter.
        </p>
        <p className="lede">
          Répondez librement, en une ligne ou en dix. Une réponse « je ne sais pas encore »
          est une information utile. Vos réponses s'enregistrent dans votre navigateur au fur
          et à mesure : vous pouvez fermer et revenir plus tard.
        </p>

        <div className="cards">
          {ORDER.map((key) => {
            const p = QUESTIONNAIRES[key];
            return (
              <Link key={key} href={`/${p.slug}`} className="card">
                <span className="no">{p.index}</span>
                <h2>{p.title}</h2>
                <p>{p.teaser}</p>
                <span className="go">
                  {countQuestions(key)} questions
                  <svg width="26" height="7" viewBox="0 0 26 7" fill="none" aria-hidden="true">
                    <path d="M0 3.5h24M21 1l3 2.5L21 6" stroke="currentColor" strokeWidth="1" />
                  </svg>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}

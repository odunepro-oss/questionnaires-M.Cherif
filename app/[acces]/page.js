import { notFound } from "next/navigation";
import Questionnaire from "@/components/Questionnaire";
import { QUESTIONNAIRES, ACCES } from "@/data/questionnaires";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(ACCES).map((acces) => ({ acces }));
}

export async function generateMetadata({ params }) {
  const { acces } = await params;
  const key = ACCES[acces];
  if (!key) return { title: "Odune" };
  return { title: `Odune · ${QUESTIONNAIRES[key].title}` };
}

export default async function Page({ params }) {
  const { acces } = await params;
  const key = ACCES[acces];
  if (!key) notFound();
  return <Questionnaire data={QUESTIONNAIRES[key]} />;
}

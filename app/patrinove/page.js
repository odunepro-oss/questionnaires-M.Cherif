import Questionnaire from "@/components/Questionnaire";
import { QUESTIONNAIRES } from "@/data/questionnaires";

export const metadata = { title: "Odune · Patrinove" };

export default function Page() {
  return <Questionnaire data={QUESTIONNAIRES["patrinove"]} />;
}

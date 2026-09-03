import Questionnaire from "@/components/Questionnaire";
import { QUESTIONNAIRES } from "@/data/questionnaires";

export const metadata = { title: "Odune · Marque de soins intimes" };

export default function Page() {
  return <Questionnaire data={QUESTIONNAIRES["soins-intimes"]} />;
}

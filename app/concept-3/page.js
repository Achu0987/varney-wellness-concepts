import { Jost } from 'next/font/google';
import Concept3 from '@/components/c3/Concept3';

const jost = Jost({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--c3-font', display: 'swap' });

export const metadata = {
  title: 'Varney Wellness | Concept 03: The Human Experience',
  description: 'Concept homepage for Varney Wellness: a bold, playful, interactive experience with a live private Botox Party planner. Illustrative copy; placeholders where marked.',
};

export default function Page() {
  return <Concept3 fontClass={jost.variable} />;
}

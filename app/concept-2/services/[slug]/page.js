import Service from '@/components/c2/pages/Service';
import { SERVICES } from '@/components/c2/site/data';
export function generateStaticParams() { return SERVICES.map((s) => ({ slug: s.slug })); }
export function generateMetadata({ params }) {
  const s = SERVICES.find((x) => x.slug === params.slug) || SERVICES[0];
  return { title: `${s.t} | Varney Wellness`, description: `${s.lead} Illustrative concept page.` };
}
export default function Page({ params }) { return <Service slug={params.slug} />; }

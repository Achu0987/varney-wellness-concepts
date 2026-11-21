import { A } from '@/lib/asset';

/* Illustrative service areas. The final menu, wording and availability are confirmed with Dr. Varney. */
export const SERVICES = [
  {
    slug: 'personalized-wellness', img3: A('/c2/smile.jpg'), alt3: 'A smiling woman in a white top (stock photo)',
    t: 'Personalized Wellness',
    img: A('/c2/golden.jpg'), pos: '50% 30%', alt: 'A woman resting her face in her hands in warm evening light (stock photo)',
    img2: A('/c2/products.jpg'), alt2: 'Skincare bottles on a wooden tray beside a branch (stock photo)',
    short: 'A plan written around your health, history and goals.',
    lead: 'A wellness plan written around your health, your history and the life you actually live.',
    intro: 'It begins with a long conversation rather than a form. Together you look at where you are, where you would like to be, and the realistic steps in between. The plan is yours, written in plain language, and it changes as you do.',
    suits: ['You want a clearer picture of your overall health', 'You prefer one physician who knows your history', 'You would like practical changes that last', 'You want regular check-ins, not one-off visits'],
    steps: [
      ['A first conversation', 'Your goals, your routine and what has or has not worked before.'],
      ['A medical assessment', 'History and any checks the physician recommends, so advice is safe for you.'],
      ['Your written plan', 'Clear priorities and options, explained without jargon.'],
      ['Check-ins', 'Follow-up at a pace that suits you, adjusted as life changes.'],
    ],
  },
  {
    slug: 'aesthetic-care', img3: A('/c2/bridal.jpg'), alt3: 'A woman holding flowers in a sunny field (stock photo)',
    t: 'Advanced Aesthetic Care',
    img: A('/c2/serum.jpg'), pos: '40% 40%', alt: 'A woman touching her cheek beside a glass bottle (stock photo)',
    img2: A('/c2/lotion.jpg'), alt2: 'Close-up of cream being applied to a cheek (stock photo)',
    short: 'Subtle, physician-led treatments that still look like you.',
    lead: 'Subtle, physician-led aesthetic care, planned so that you still look like yourself.',
    intro: 'Aesthetic treatment starts with a medical assessment, not a price list. Options are explained honestly, including doing nothing, and any treatment is planned conservatively around your features and your comfort.',
    suits: ['You want natural, conservative results', 'You value a medical assessment before any treatment', 'You would like every option explained, including doing nothing', 'You prefer a private, unhurried setting'],
    steps: [
      ['Consultation', 'What you would like to change and why, in a private room with time to talk.'],
      ['Assessment', 'Medical history and suitability, reviewed by the physician-led team.'],
      ['A considered plan', 'Options, expected recovery and realistic outcomes, in writing.'],
      ['Review', 'A follow-up to see how you feel and whether anything needs adjusting.'],
    ],
    note: 'Specific treatments (for example, neuromodulators such as Botox) are listed once the practice confirms them. Suitability is always decided at consultation.',
  },
  {
    slug: 'health-wellbeing', img3: A('/images/care2.jpg'), alt3: 'A warm, quiet treatment lounge (stock photo)',
    t: 'Health & Wellbeing',
    img: A('/c2/pool.jpg'), pos: '50% 55%', alt: 'A calm indoor pool with tall windows onto trees (stock photo)',
    img2: A('/c2/tubview.jpg'), alt2: 'A dark bathing room with a wide window onto mountains (stock photo)',
    short: 'Everyday health, cared for by a doctor who knows your story.',
    lead: 'Everyday health, looked after by a doctor who knows your story and has time to listen.',
    intro: 'Good care is easier when appointments are not rushed. Health & Wellbeing brings unhurried visits, continuity with one physician and guidance that fits around work, family and rest.',
    suits: ['You want appointments that are never rushed', 'You would like support with long-term health goals', 'You want guidance that fits real life', 'You value seeing the same physician each time'],
    steps: [
      ['Get to know you', 'A full history and a conversation about what matters most to you.'],
      ['Look closer', 'Any assessments the physician recommends, explained before and after.'],
      ['Agree the next steps', 'A shared plan, with the reasons behind each recommendation.'],
      ['Stay in touch', 'Follow-up whenever you need it, with the same team.'],
    ],
  },
  {
    slug: 'wellness-journey', img3: A('/c2/shadow2.jpg'), alt3: 'Soft leaf shadows on a pale wall (stock photo)',
    t: 'Your Wellness Journey',
    img: A('/c2/tubview.jpg'), pos: '50% 50%', alt: 'A dark bathing room with a wide window onto snowy mountains (stock photo)',
    img2: A('/c2/bath.jpg'), alt2: 'Candles and a glass beside a bath (stock photo)',
    short: 'Ongoing care that keeps your plan moving with your life.',
    lead: 'Ongoing care that keeps your plan moving with your life, season after season.',
    intro: 'Plans work best when someone keeps them current. Your Wellness Journey is the long view: regular reviews, small adjustments and a team that remembers what you said last time.',
    suits: ['You have a plan and want help keeping it current', 'Your goals change with seasons of life', 'You want a regular moment to pause and review', 'You like having one team on your side'],
    steps: [
      ['Where you are now', 'A review of your plan and how the last few months have felt.'],
      ['What has changed', 'New goals, new circumstances, anything the plan should reflect.'],
      ['Adjust together', 'Small, considered changes rather than starting again.'],
      ['Next review', 'A date that suits you, and a way to reach the team in between.'],
    ],
  },
];

export const FAQ = [
  ['The club', [
    ['Is Varney Wellness open yet?', 'The practice is in development. Opening dates and availability will be shared here and in The Varney Letter.'],
    ['Where are you?', 'In Florida. The full address will be published once the practice confirms it.'],
    ['Do I need to be a member?', 'Details of how the club works are being finalised with Dr. Varney and will appear here before launch.'],
  ]],
  ['Consultations', [
    ['Does every treatment start with a consultation?', 'Yes. Every plan begins with a conversation and a medical assessment by the physician-led team.'],
    ['How much does it cost?', 'Pricing is confirmed by the practice and explained clearly at your consultation, before anything is agreed.'],
    ['Do you accept insurance?', 'To be confirmed by the practice.'],
    ['What if I need to cancel?', 'The cancellation policy will be published here once the practice confirms it.'],
  ]],
  ['Private parties', [
    ['Is a party request a booking?', 'No. The planner sends an event inquiry only. The practice reviews it and replies with what is possible.'],
    ['Can every guest be treated?', 'Not necessarily. Each guest has their own consultation and assessment, and treatment only goes ahead when it is suitable for them.'],
    ['Can the party be at my home?', 'Private residences and venues may be possible, subject to the practice approving the setting.'],
  ]],
];

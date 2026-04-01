import { Article, Author, Category, VisualStory } from './types';

export const mockCategories: Category[] = [
  { id: 'cat_india', name: 'India', slug: 'india', description: 'National news and major breaking stories.' },
  { id: 'cat_states', name: 'States', slug: 'states', description: 'Regional news from across all Indian states.' },
  { id: 'cat_politics', name: 'Politics', slug: 'politics', description: 'Elections, policies, and partisan shifts.' },
  { id: 'cat_economy', name: 'Economy', slug: 'economy', description: 'Budgets, markets, Sensex, and corporate India.' },
  { id: 'cat_tech', name: 'Technology', slug: 'technology', description: 'Bengaluru ecosystem, AI, and IT industry.' },
  { id: 'cat_sports', name: 'Sports', slug: 'sports', description: 'Cricket, Olympics, and national sporting events.' },
  { id: 'cat_ent', name: 'Entertainment', slug: 'entertainment', description: 'Bollywood, regional cinema, and pop culture.' },
  { id: 'cat_explainers', name: 'Explainers', slug: 'explainers', description: 'Deep dives and analysis.' },
  { id: 'cat_videos', name: 'Videos', slug: 'videos', description: 'Visual storytelling.' },
  { id: 'cat_jobs', name: 'Jobs', slug: 'jobs', description: 'Employment news and career opportunities.' },
  { id: 'cat_exams', name: 'Exams', slug: 'exams', description: 'Competitive exams, results, and notifications.' },
];

export const mockAuthors: Author[] = [
  {
    id: 'auth_1',
    name: 'Aarav Sharma',
    role: 'Editor-in-Chief',
    email: 'aarav.sharma@drishyam.news',
    avatar: '/mock/avatars/aarav.jpg',
    bio: 'Veteran journalist with 20 years covering national security.'
  },
  {
    id: 'auth_2',
    name: 'Priya Patel',
    role: 'Senior Political Correspondent',
    email: 'priya.patel@drishyam.news',
    avatar: '/mock/avatars/priya.jpg',
    bio: 'Specialist in state elections and parliamentary affairs.'
  },
  {
    id: 'auth_3',
    name: 'Rahul Desai',
    role: 'Economy Editor',
    email: 'rahul.desai@drishyam.news',
    avatar: '/mock/avatars/rahul.jpg',
    bio: 'Former financial analyst bringing numbers to the news.'
  },
  {
    id: 'auth_4',
    name: 'Ananya Singh',
    role: 'Tech Reporter',
    email: 'ananya.s@drishyam.news',
    avatar: '/mock/avatars/ananya.jpg',
    bio: 'Covering the latest out of Bengaluru and global AI.'
  },
  {
    id: 'auth_5',
    name: 'Arjun Menon',
    role: 'Sports Journalist',
    email: 'arjun.m@drishyam.news',
    avatar: '/mock/avatars/arjun.jpg',
    bio: 'On the ground for every major cricket series.'
  }
];

// Let this array be exported as `let` so we can mutate it (push new articles) during development
export let mockArticles: Article[] = [
  {
    id: 'art_000',
    title: 'Why the New Education Policy is a Game-Changer for Rural India',
    slug: 'new-education-policy-opinion',
    excerpt: 'An in-depth look at how decentralizing the curriculum could finally bridge the urban-rural divide in primary education.',
    content: '<p>The recent shift in the National Education Policy represents more than just a administrative change. It is a fundamental rethinking of how knowledge is delivered to the millions who reside outside our metropolitan hubs.</p><p>For decades, the standard curriculum has been heavily tilted towards urban scenarios, often alienating students whose daily lives and challenges are rooted in agriculture and local trade.</p>',
    categoryId: 'cat_india',
    authorId: 'auth_1', // Aarav Sharma
    status: 'published',
    featured: false,
    articleType: 'opinion',
    createdAt: '2026-03-30T10:00:00Z',
    coverImage: '/mock/images/education.jpg',
    tags: ['Education', 'Policy', 'Rural Development']
  },
  {
    id: 'art_001',
    title: 'Union Budget 2026: Finance Minister Details Major Middle-Class Tax Relief',
    slug: 'union-budget-2026-middle-class-tax-relief',
    excerpt: 'The upcoming budget promises significant changes to income tax slabs, aiming to ease the burden on salaried employees ahead of key state elections.',
    content: '<p>Complete budget breakdown in HTML format...</p>',
    categoryId: 'cat_economy',
    authorId: 'auth_3',
    status: 'published',
    featured: true,
    views: 45200,
    createdAt: '2026-03-29T08:30:00Z',
    updatedAt: '2026-03-29T10:15:00Z',
    coverImage: '/mock/images/budget.jpg',
    tags: ['Budget', 'Finance', 'Taxes'],
    articleType: 'standard'
  },
  {
    id: 'art_002',
    title: 'ISRO Prepares for Next Generation Launch Vehicle Test Flight',
    slug: 'isro-nglv-test-flight-preparations',
    excerpt: 'Sriharikota gears up to test the heavy-lift NGLV, designed to replace the trusted LVM3 and pave the way for India\'s space station.',
    content: '<p>Spaceport preparations detailed here...</p>',
    categoryId: 'cat_tech',
    authorId: 'auth_4',
    status: 'published',
    featured: true,
    views: 31050,
    createdAt: '2026-03-29T09:00:00Z',
    updatedAt: '2026-03-29T09:00:00Z',
    coverImage: '/mock/images/isro.jpg',
    tags: ['ISRO', 'Space', 'Tech']
  },
  {
    id: 'art_003',
    title: 'Assembly Elections: Heavy Voter Turnout Recorded in First Phase',
    slug: 'assembly-elections-first-phase-turnout',
    excerpt: 'Reports suggest a massive surge in rural voter participation across four major states during the crucial first phase of voting.',
    content: '<p>Live tracking of voter booths...</p>',
    categoryId: 'cat_politics',
    authorId: 'auth_2',
    status: 'published',
    featured: false,
    views: 89045,
    createdAt: '2026-03-28T14:30:00Z',
    updatedAt: '2026-03-29T07:20:00Z',
    coverImage: '/mock/images/elections.jpg',
    tags: ['Elections', 'Politics', 'Democracy']
  },
  {
    id: 'art_004',
    title: 'Sensex Hits Historic Milestone Driven by Tech Rally',
    slug: 'sensex-historic-milestone-tech-rally',
    excerpt: 'Indian markets closed at an all-time high today, spearheaded by major gains in IT sector stocks following solid quarterly earnings.',
    content: '<p>Market summary goes here...</p>',
    categoryId: 'cat_economy',
    authorId: 'auth_3',
    status: 'published',
    featured: false,
    views: 12400,
    createdAt: '2026-03-28T16:00:00Z',
    updatedAt: '2026-03-28T16:00:00Z',
    coverImage: '/mock/images/sensex.jpg',
    tags: ['Markets', 'Sensex', 'Tech']
  },
  {
    id: 'art_005',
    title: 'India Wins T20 Series Decider in Nail-Biting Finish',
    slug: 'india-wins-t20-series-decider',
    excerpt: 'A brilliant final over from the returning fast bowler secured the series victory for India in front of a packed Wankhede stadium.',
    content: '<p>Match report...</p>',
    categoryId: 'cat_sports',
    authorId: 'auth_5',
    status: 'published',
    featured: true,
    views: 105600,
    createdAt: '2026-03-27T22:30:00Z',
    updatedAt: '2026-03-27T23:10:00Z',
    coverImage: '/mock/images/cricket.jpg',
    tags: ['Cricket', 'BCCI', 'T20']
  },
  {
    id: 'art_006',
    title: 'New AI Policy Framework to be Tabled in Parliament',
    slug: 'new-ai-policy-framework-parliament',
    excerpt: 'The IT Ministry has finalized the draft bill outlining regulations for artificial intelligence development and data privacy.',
    content: '<p>Details on the bill...</p>',
    categoryId: 'cat_tech',
    authorId: 'auth_4',
    status: 'review',
    featured: false,
    views: 0,
    createdAt: '2026-03-29T11:00:00Z',
    updatedAt: '2026-03-29T11:30:00Z',
    coverImage: '/mock/images/ai-policy.jpg',
    tags: ['AI', 'Policy', 'Tech']
  },
  {
    id: 'art_007',
    title: 'Global Summit 2026: Prime Minister Arrives in European Capital',
    slug: 'global-summit-2026-pm-arrival',
    excerpt: 'India prepares to push for climate financing and reformed multilateral institutions at the crucial global meeting.',
    content: '<p>Diplomatic updates...</p>',
    categoryId: 'cat_india',
    authorId: 'auth_1',
    status: 'draft',
    featured: false,
    views: 0,
    createdAt: '2026-03-29T12:45:00Z',
    updatedAt: '2026-03-29T12:45:00Z',
    coverImage: '/mock/images/summit.jpg',
    tags: ['Diplomacy', 'World', 'India']
  },
  {
    id: 'art_008',
    title: 'Major Bollywood Sequel Breaks Box Office Records on Opening Weekend',
    slug: 'bollywood-sequel-breaks-box-office-records',
    excerpt: 'The highly anticipated action thriller has shattered domestic records, grossing over ₹150 crore in its first three days.',
    content: '<p>Entertainment news...</p>',
    categoryId: 'cat_ent',
    authorId: 'auth_1',
    status: 'published',
    featured: false,
    views: 22000,
    createdAt: '2026-03-26T08:00:00Z',
    updatedAt: '2026-03-26T08:00:00Z',
    coverImage: '/mock/images/bollywood.jpg',
    tags: ['Bollywood', 'Entertainment', 'Box Office']
  },
  {
    id: 'art_009',
    title: 'Monsoon Arrives Early Over Kerala Coast, IMD Highlights Shift',
    slug: 'monsoon-arrives-early-kerala',
    excerpt: 'The IMD confirmed that the southwest monsoon has made landfall three days ahead of schedule, sparking relief for the agricultural sector across southern states.',
    content: '<p>Weather updates...</p>',
    categoryId: 'cat_states',
    authorId: 'auth_2',
    status: 'draft',
    featured: false,
    views: 0,
    createdAt: '2026-03-29T14:10:00Z',
    updatedAt: '2026-03-29T14:10:00Z',
    coverImage: '/mock/images/semiconductor.jpg',
    tags: ['Tech', 'Manufacturing', 'Economy'],
    articleType: 'explainer',
    keyPoints: [
      'Government approves $10B in incentives for local chip production.',
      'Three major global players are in final talks for a Gujarat-based fab.',
      'Potential to create 50,000 high-tech jobs by 2028.'
    ]
  },
  {
    id: 'art_010',
    title: 'EV Subsidy Scheme Expanded by Transport Ministry to Boost Adoption',
    slug: 'ev-subsidy-scheme-expanded',
    excerpt: 'Buyers of electric two-wheelers will see renewed subsidies under the latest iteration of the FAME initiative focusing on Tier-2 cities.',
    content: '<p>Automotive news...</p>',
    categoryId: 'cat_india',
    authorId: 'auth_3',
    status: 'published',
    featured: false,
    views: 18500,
    createdAt: '2026-03-25T10:00:00Z',
    updatedAt: '2026-03-25T10:00:00Z',
    coverImage: '/mock/images/ev.jpg',
    tags: ['Automotive', 'EV', 'Green Energy']
  },
  {
    id: 'art_011',
    title: 'Major Recruitment Drive Announced for Public Sector Banks',
    slug: 'psu-bank-recruitment-2026',
    excerpt: 'Over 12,000 vacancies for probationary officers and clerks to be filled in the upcoming fiscal year.',
    content: '<p>Job details...</p>',
    categoryId: 'cat_jobs',
    authorId: 'auth_3',
    status: 'published',
    featured: false,
    views: 15400,
    createdAt: '2026-03-24T09:00:00Z',
    updatedAt: '2026-03-24T09:00:00Z',
    coverImage: 'https://images.unsplash.com/photo-1521791136364-798a7bc0d262?q=80&w=800&auto=format&fit=crop',
    tags: ['Jobs', 'Banking', 'Recruitment']
  },
  {
    id: 'art_012',
    title: 'UPSC Civil Services Prelims 2026: Application Window Opens',
    slug: 'upsc-prelims-2026-notification',
    excerpt: 'Aspiring candidates can now apply online through the official portal. Important dates and syllabus changes inside.',
    content: '<p>Exam notification...</p>',
    categoryId: 'cat_exams',
    authorId: 'auth_1',
    status: 'published',
    featured: false,
    views: 42000,
    createdAt: '2026-03-23T10:00:00Z',
    updatedAt: '2026-03-23T10:00:00Z',
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
    tags: ['UPSC', 'Exams', 'Education']
  },
  {
    id: 'art_exp_1',
    title: 'What the new Data Protection Bill means for your privacy',
    slug: 'data-protection-bill-explainer',
    excerpt: 'An in-depth look at the implications of the latest privacy regulations.',
    content: '<p>Detailed explainer on data protection...</p>',
    categoryId: 'cat_explainers',
    authorId: 'auth_4',
    status: 'published',
    createdAt: '2026-03-29T10:00:00Z',
    articleType: 'explainer'
  },
  {
    id: 'art_exp_2',
    title: 'Decoding the Interim Budget 2026: Key Takeaways',
    slug: 'interim-budget-2026-explained',
    excerpt: 'Everything you need to know about the 2026 interim budget.',
    content: '<p>Budget analysis...</p>',
    categoryId: 'cat_explainers',
    authorId: 'auth_3',
    status: 'published',
    createdAt: '2026-03-29T11:00:00Z',
    articleType: 'explainer'
  },
  {
    id: 'art_exp_3',
    title: 'Understanding the changes in NEET PG 2026 Exam Pattern',
    slug: 'neet-pg-2026-changes',
    excerpt: 'A guide to the updated exam structure for medical aspirants.',
    content: '<p>NEET PG updates...</p>',
    categoryId: 'cat_explainers',
    authorId: 'auth_1',
    status: 'published',
    createdAt: '2026-03-29T12:00:00Z',
    articleType: 'explainer'
  },
  {
    id: 'art_op_1',
    title: 'The rural economy needs a structural overhaul, not just subsidies.',
    slug: 'rural-economy-overhaul',
    excerpt: 'Why a paradigm shift is needed in Indias agricultural heartland.',
    content: '<p>Opinion on rural economy...</p>',
    categoryId: 'cat_economy',
    authorId: 'auth_1',
    status: 'published',
    createdAt: '2026-03-28T09:00:00Z',
    articleType: 'opinion'
  },
  {
    id: 'art_op_2',
    title: 'Why AI regulation in India must balance innovation with ethics.',
    slug: 'ai-regulation-india',
    excerpt: 'Finding the middle ground in the rapidly evolving AI landscape.',
    content: '<p>Ethical AI frameworks...</p>',
    categoryId: 'cat_tech',
    authorId: 'auth_4',
    status: 'published',
    createdAt: '2026-03-28T10:00:00Z',
    articleType: 'opinion'
  },
  {
    id: 'art_op_3',
    title: 'A golden age for Indian sports is finally dawning.',
    slug: 'indian-sports-golden-age',
    excerpt: 'Tracing the rise of Indias multi-sport environment.',
    content: '<p>The future of Indian sports...</p>',
    categoryId: 'cat_sports',
    authorId: 'auth_5',
    status: 'published',
    createdAt: '2026-03-28T11:00:00Z',
    articleType: 'opinion'
  },
  {
    id: 'art_op_4',
    title: 'The shifting dynamics of coalition politics ahead of 2029.',
    slug: 'coalition-politics-2029',
    excerpt: 'Analyzing the alliances that could shape Indias future governance.',
    content: '<p>Coalition politics analysis...</p>',
    categoryId: 'cat_politics',
    authorId: 'auth_2',
    status: 'published',
    createdAt: '2026-03-28T12:00:00Z',
    articleType: 'opinion'
  },
  {
    id: 'art_vid_1',
    title: 'Why is the stock market rallying before elections?',
    slug: 'stock-market-rally',
    excerpt: 'Video analysis of market trends ahead of the 2029 polls.',
    content: '<p>Video commentary on market rally...</p>',
    categoryId: 'cat_videos',
    authorId: 'auth_3',
    status: 'published',
    createdAt: '2026-03-27T10:00:00Z'
  },
  {
    id: 'art_vid_2',
    title: 'Full Interview: PM on future of tech in India',
    slug: 'pm-interview-tech',
    excerpt: 'Exclusive video interview on Indias digital transformation goals.',
    content: '<p>Interview transcript highlights...</p>',
    categoryId: 'cat_videos',
    authorId: 'auth_1',
    status: 'published',
    createdAt: '2026-03-27T11:00:00Z'
  },
  {
    id: 'art_vid_3',
    title: 'Ground Report: Drought strikes Maharashtra villages',
    slug: 'maharashtra-drought-report',
    excerpt: 'Our ground report from the most affected districts of Maharashtra.',
    content: '<p>Video report on drought situation...</p>',
    categoryId: 'cat_videos',
    authorId: 'auth_2',
    status: 'published',
    createdAt: '2026-03-27T12:00:00Z'
  },
  {
    id: 'art_vid_4',
    title: 'Startups: The funding winter is finally ending',
    slug: 'funding-winter-ends',
    excerpt: 'Is the VC drought finally coming to a close?',
    content: '<p>Analysis of current startup funding landscape...</p>',
    categoryId: 'cat_videos',
    authorId: 'auth_4',
    status: 'published',
    createdAt: '2026-03-27T13:00:00Z'
  },
  {
    id: 'art_vid_5',
    title: 'Highlights: India vs Australia 3rd Test',
    slug: 'ind-vs-aus-highlights',
    excerpt: 'Watch the best moments from a historic day of Test cricket.',
    content: '<p>Video highlights summary...</p>',
    categoryId: 'cat_videos',
    authorId: 'auth_5',
    status: 'published',
    createdAt: '2026-03-27T14:00:00Z'
  }
];

export const mockVisualStories: VisualStory[] = [
  {
    id: 's1',
    title: 'Top 10 Highest Paid Actors in Bollywood (2024)',
    slug: 'bollywood-highest-paid-actors-2024',
    category: 'Entertainment',
    coverImage: 'https://images.unsplash.com/photo-1542204111-090c29bc972e?q=80&w=600&h=900&auto=format&fit=crop',
    slides: [
      {
        id: 's1_1',
        title: 'Shah Rukh Khan',
        caption: 'With a massive ₹150+ crore per film, King Khan leads the pack.',
        image: 'https://images.unsplash.com/photo-1583091912958-3841a1edea0b?q=80&w=600&h=900&auto=format&fit=crop'
      },
      {
        id: 's1_2',
        title: 'Salman Khan',
        caption: 'Bhaijaan remains a box office magnet with ₹125 cr deals.',
        image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18977?q=80&w=600&h=900&auto=format&fit=crop'
      }
    ]
  },
  {
    id: 's2',
    title: 'Inside ISRO\'s Next-Gen Launch Pad',
    slug: 'isro-new-launch-pad-inside-look',
    category: 'Science',
    coverImage: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=600&h=900&auto=format&fit=crop',
    slides: [
      {
        id: 's2_1',
        title: 'Future Ready',
        caption: 'The new pad is built to handle reusable commercial rockets.',
        image: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=600&h=900&auto=format&fit=crop'
      },
      {
        id: 's2_2',
        title: 'Strategic Edge',
        caption: 'Located for optimal orbital injection paths.',
        image: 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?q=80&w=600&h=900&auto=format&fit=crop'
      }
    ]
  },
  {
    id: 's3',
    title: '5 Hidden iPhone Features You Didn\'t Know',
    slug: '5-hidden-iphone-features-guide',
    category: 'Technology',
    coverImage: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba3f9e?q=80&w=600&h=900&auto=format&fit=crop',
    slides: [
      {
        id: 's3_1',
        title: 'Back Tap',
        caption: 'Trigger actions by double-tapping the back of your phone.',
        image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?q=80&w=600&h=900&auto=format&fit=crop'
      },
      {
        id: 's3_2',
        title: 'Visual Look Up',
        caption: 'Identify plants and landmarks directly from your photos.',
        image: 'https://images.unsplash.com/photo-1556656793-062ff987b508?q=80&w=600&h=900&auto=format&fit=crop'
      }
    ]
  }
];

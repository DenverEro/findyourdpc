
import { Practice, BlogPost, Review } from './types';

export const MOCK_PRACTICES: Practice[] = [
  {
    id: '1',
    name: 'Evergreen Direct Care',
    doctor: 'Dr. Sarah Mitchell',
    address: '123 Pine St',
    city: 'Seattle',
    state: 'WA',
    zip: '98101',
    phone: '(206) 555-0123',
    website: 'https://evergreen.dpc',
    physicians: ['Dr. Sarah Mitchell'],
    specialties: ['Family Medicine', 'Holistic Wellness'],
    description: 'Personalized primary care with a focus on holistic wellness and preventative medicine. We offer 24/7 access to your doctor.',
    priceRange: '$75 - $150/mo',
    rating: 4.8,
    reviewsCount: 24,
    isClaimed: true,
    isAccepting: true,
    isHSACompliant: true,
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200',
    tags: ['Family Medicine', 'Mental Health', 'Holistic'],
    pricingBreakdown: [],
    slug: 'washington/seattle/evergreen-direct-care'
  },
  {
    id: '2',
    name: 'Blue Sky Family Health',
    doctor: 'Dr. James Wilson',
    address: '456 Horizon Way',
    city: 'Denver',
    state: 'CO',
    zip: '80202',
    phone: '(303) 555-0987',
    website: 'https://bluesky.health',
    physicians: ['Dr. James Wilson'],
    specialties: ['Pediatrics', 'Chronic Care'],
    description: 'Affordable, transparent healthcare for the whole family. No insurance needed, no co-pays, just great care.',
    priceRange: '$60 - $120/mo',
    rating: 4.5,
    reviewsCount: 15,
    isClaimed: false,
    isAccepting: true,
    isHSACompliant: true,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200',
    tags: ['Pediatrics', 'Chronic Care', 'Labs Included'],
    pricingBreakdown: [],
    slug: 'colorado/denver/blue-sky-family-health'
  },
  {
    id: '3',
    name: 'Summit DPC',
    doctor: 'Dr. Elena Rodriguez',
    address: '789 Peak Blvd',
    city: 'Asheville',
    state: 'NC',
    zip: '28801',
    phone: '(828) 555-4433',
    website: 'https://summitdpc.com',
    physicians: ['Dr. Elena Rodriguez'],
    specialties: ['Sports Medicine', 'Nutrition'],
    description: 'High-altitude healthcare with a focus on longevity and performance. We cater to active lifestyles and outdoor enthusiasts.',
    priceRange: '$85 - $160/mo',
    rating: 4.9,
    reviewsCount: 32,
    isClaimed: true,
    isAccepting: true,
    isHSACompliant: false,
    image: 'https://images.unsplash.com/photo-1504813184591-01592fd03cfd?auto=format&fit=crop&q=80&w=1200',
    tags: ['Sports Medicine', 'Nutrition', 'Urgent Care'],
    pricingBreakdown: [],
    slug: 'north-carolina/asheville/summit-dpc'
  },
  {
    id: '4',
    name: 'Coastal Direct Medicine',
    doctor: 'Dr. Michael Chen',
    address: '101 Shoreline Dr',
    city: 'San Diego',
    state: 'CA',
    zip: '92101',
    phone: '(619) 555-1212',
    website: 'https://coastaldpc.io',
    physicians: ['Dr. Michael Chen'],
    specialties: ['Internal Medicine', 'Tech Savvy Care'],
    description: 'Direct primary care for the modern professional. Extended visits, direct texting, and same-day appointments.',
    priceRange: '$90 - $200/mo',
    rating: 4.2,
    reviewsCount: 8,
    isClaimed: false,
    isAccepting: false,
    isHSACompliant: true,
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1200',
    tags: ['Concierge Feel', 'Tech Savvy', 'Adult Medicine'],
    pricingBreakdown: [],
    slug: 'california/san-diego/coastal-direct-medicine'
  }
];

export const MOCK_BLOGS: BlogPost[] = [
  {
    id: 'b-michigan-rates',
    title: 'Why Your Michigan Health Insurance Just Jumped 20% (and the $70 Alternative)',
    excerpt: 'Blue Cross Blue Shield of Michigan raised rates by 24% in 2026. Discover how Direct Primary Care offers a $70-85/mo alternative.',
    content: 'Blue Cross Blue Shield of Michigan raised rates by 24% in 2026. This article explores the root causes—including the federal subsidy cliff—and highlights Direct Primary Care as a viable, affordable alternative starting at $70/month.',
    author: 'Health Watch Editor',
    date: 'Jan 15, 2026',
    category: 'Market Trends',
    image: 'https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&q=80&w=1200',
    slug: 'why-your-michigan-health-insurance-just-jumped-20-percent'
  },
  {
    id: 'b1',
    title: 'What is Direct Primary Care?',
    excerpt: 'Learn why thousands of patients are ditching insurance for a direct relationship with their doctor.',
    content: 'Direct Primary Care (DPC) is a healthcare model where patients pay a monthly membership fee directly to their doctor, bypassing traditional insurance. This model allows for longer appointments, 24/7 access to your physician, and a focus on preventive care without the administrative burden of insurance billing.',
    author: 'Admin',
    category: 'Education',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200',
    slug: 'what-is-direct-primary-care'
  },
  {
    id: 'b2',
    title: '5 Reasons to Choose DPC Over Traditional Care',
    excerpt: 'From no co-pays to 60-minute appointments, see how the model benefits you.',
    content: '1. No co-pays or deductibles for primary care visits. 2. Appointments last 30-60 minutes instead of the typical 7-15 minutes. 3. 24/7 access to your doctor via text, email, or phone. 4. Same-day or next-day appointments are standard. 5. Focus on preventive care and building a real relationship with your physician.',
    author: 'Dr. Sarah Mitchell',
    category: 'Patients',
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=1200',
    slug: '5-reasons-to-choose-dpc-over-traditional-care'
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    practiceId: '1',
    author: 'John Doe',
    rating: 5,
    content: 'Best medical experience of my life. Dr. Mitchell actually listens!',
    date: '2 days ago'
  },
  {
    id: 'r2',
    practiceId: '1',
    author: 'Jane Smith',
    rating: 4,
    content: 'Great office environment, very responsive to texts.',
    date: '1 week ago'
  }
];

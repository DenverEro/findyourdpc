
export interface Practice {
  id: string;
  name: string;
  doctor: string; // Keep for UI compatibility (mapped from physicians)
  physicians: string[];
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  website: string;
  description: string;
  priceRange: string;
  rating: number;
  reviewsCount: number;
  isClaimed: boolean;
  isAccepting: boolean;
  isHSACompliant: boolean;
  image: string;
  tags: string[];
  practiceType?: string;
  specialties: string[];
  googleRating?: number;
  googleReviewsCount?: number;
  googlePlaceId?: string;
  pricingBreakdown: string[];
  slug: string;
  lat?: number;
  lng?: number;
}

export interface Review {
  id: string;
  practiceId: string;
  author: string;
  rating: number;
  content: string;
  date: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date?: string;
  category: string;
  image: string;
}

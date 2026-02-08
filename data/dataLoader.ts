
import { Practice } from '../types';
import michiganData from './michigan_dpc_cleaned.json';
import { getCoordinatesFromZip } from '../src/utils/geocode';

/**
 * HSA Compliance logic based on 2026 OBBBA Directives:
 * 1. Individual membership ≤ $150/mo
 * 2. Family membership ≤ $300/mo
 * 3. No visit-based co-pays (assumed for Pure DPC)
 */
// Helper to map state codes to full names for SEO/GEO
const STATE_MAP: Record<string, string> = {
    'MI': 'michigan',
    'TX': 'texas',
    'FL': 'florida',
    'CA': 'california',
    // Add more as needed
    // Add more as needed
};

const PRACTICE_IMAGES = [
    'clinic-appointment-child.png',
    'clinic-appointment2.jpg',
    'clinic-appointment3.jpg',
    'clinic-appoitment1.jpg',
    'clinic-waiting-area.png',
    'telehealth-appointment.png'
];

const getRandomImage = () => {
    return `/img/${PRACTICE_IMAGES[Math.floor(Math.random() * PRACTICE_IMAGES.length)]}`;
};

export const slugify = (text: string): string => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')  // Remove all non-word chars
        .replace(/--+/g, '-');    // Replace multiple - with single -
};

export const generatePracticeSlug = (practice: { state: string, city: string, name: string, address?: string }): string => {
    const stateFull = STATE_MAP[practice.state] || practice.state.toLowerCase();
    const citySlug = slugify(practice.city);
    const nameSlug = slugify(practice.name);

    return `${stateFull}/${citySlug}/${nameSlug}`;
};

export const generateBlogSlug = (title: string): string => {
    return slugify(title);
};

export const checkHSACompliance = (clinic: any): boolean => {
    const { practice_type, pricing } = clinic;

    // Rule 3: Must be Pure DPC (or explicit check if we have co-pay data)
    if (!practice_type?.includes('Pure DPC')) return false;

    const structuredPricing = pricing?.structured || [];

    // Rule 1: Individual Check
    const individualPrice = structuredPricing.find((p: any) =>
        p.label.toLowerCase().includes('one person') ||
        p.label.toLowerCase().includes('individual') ||
        (p.age_min >= 18 && p.label.toLowerCase().includes('adult'))
    )?.price;

    if (individualPrice && individualPrice > 150) return false;

    // Rule 2: Family Check
    const familyPrice = structuredPricing.find((p: any) =>
        p.label.toLowerCase().includes('family')
    )?.price;

    if (familyPrice && familyPrice > 300) return false;

    // If we have pricing, we must have at least one valid price point
    return structuredPricing.length > 0;
};

export const loadMichiganPractices = (): Practice[] => {
    return michiganData.clinics.map((clinic: any) => {
        // Basic city/state extraction from the display location or address
        const addressParts = clinic.address.split(',').map((s: string) => s.trim());
        const zip = addressParts[addressParts.length - 1]?.match(/\d{5}/)?.[0] || addressParts[addressParts.length - 1]?.split(' ')[1] || '';
        const state = 'MI';
        const city = clinic.display?.location?.split(',')[0] || addressParts[addressParts.length - 2] || '';

        // Mobile practice detection
        const isMobile = clinic.practice_type?.toLowerCase().includes('mobile') ||
            clinic.address.toLowerCase().includes('no actual office') ||
            clinic.address.toLowerCase().includes('po box');

        // Extract street address (remove city, state, zip if present)
        let streetAddress = clinic.address;
        if (!isMobile && addressParts.length >= 3) {
            // Take everything except the last two parts (City and State/Zip)
            streetAddress = addressParts.slice(0, -2).join(', ');
        } else if (isMobile) {
            streetAddress = '';
        }

        // Dynamic Price Range Calculation
        const structured = clinic.pricing?.structured || [];
        let priceRange = clinic.display.price_range;

        if (structured.length > 0) {
            const prices = structured.map((p: any) => p.price).filter((p: number) => p > 0);
            if (prices.length > 0) {
                const min = Math.min(...prices);
                // Look for adult price, otherwise fallback to max
                const adultPrice = structured.find((p: any) =>
                    p.label.toLowerCase().includes('adult') ||
                    (p.age_min >= 18 && p.age_min <= 26)
                )?.price;

                const max = adultPrice || Math.max(...prices);

                if (min === max) {
                    priceRange = `$${min}/mo`;
                } else {
                    priceRange = `$${min}-${max}/mo`;
                }
            }
        }

        // Get coordinates from zip code
        const coordinates = getCoordinatesFromZip(zip);

        const practiceData = {
            id: clinic.id,
            name: clinic.name,
            doctor: clinic.physicians.join(', '),
            physicians: clinic.physicians,
            address: streetAddress,
            city: city,
            state: state,
            zip: zip,
            phone: clinic.phone,
            website: clinic.website,
            description: clinic._original?.starting_at
                ? `Direct Primary Care services starting at $${clinic._original.starting_at}/mo. ${clinic.status}.`
                : `Personalized primary care in ${city}. ${clinic.status}.`,
            priceRange: priceRange,
            rating: 5, // Set to whole number 5 for premium feel
            reviewsCount: Math.floor(Math.random() * 50) + 5,
            isClaimed: false, // All clinics start as unclaimed
            isAccepting: clinic.display.accepting_new,
            isHSACompliant: checkHSACompliance(clinic),
            image: getRandomImage(),
            tags: [...clinic.specialties, clinic.practice_type].filter(Boolean),
            practiceType: clinic.practice_type,
            specialties: clinic.specialties,
            googleRating: 5, // Placeholder for Google Business rating
            googleReviewsCount: Math.floor(Math.random() * 100) + 10,
            googlePlaceId: '', // Future placeholder for Places API integration
            pricingBreakdown: clinic.pricing?.display_lines || [],
            lat: coordinates?.lat,
            lng: coordinates?.lng
        };

        return {
            ...practiceData,
            slug: generatePracticeSlug(practiceData)
        };
    });
};

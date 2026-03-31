import { Property } from './types';

export const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Luminous Sky Loft',
    location: 'Los Angeles',
    price: 2400,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 850,
    bedsRange: 'Studio - 1',
    bathsRange: '1',
    sqftRange: '550 - 950',
    image: 'https://picsum.photos/seed/loft-living/1200/800',
    images: [
      'https://picsum.photos/seed/loft-living/1200/800',
      'https://picsum.photos/seed/loft-bedroom/1200/800',
      'https://picsum.photos/seed/loft-kitchen/1200/800'
    ],
    imageSeed: 'loft-living',
    amenities: ['Balcony', 'Gym', 'Pool', 'Smart Home'],
    coordinates: { lat: 40.7128, lng: -74.0060 },
    type: 'Loft',
    description: 'A breathtaking loft with floor-to-ceiling windows overlooking the city skyline. Features integrated smart home systems and warm ambient lighting.',
    rating: 4.9,
    matchReason: 'Zillow: Modern Lofts',
    floorPlans: [
      {
        type: 'Studio',
        priceRange: '$1,800 - $2,100',
        sqft: '550 - 650',
        available: 2,
        units: [
          { 
            id: 'Unit 101', 
            price: '$1,850', 
            sqft: '580',
            amenities: ['City View', 'New Appliances', 'Walk-in Closet', 'Hardwood Floors'], 
            image: 'https://picsum.photos/seed/unit101/600/400',
            images: [
              'https://picsum.photos/seed/unit101-1/1200/800',
              'https://picsum.photos/seed/unit101-2/1200/800',
              'https://picsum.photos/seed/unit101-3/1200/800'
            ]
          },
          { 
            id: 'Unit 201', 
            price: '$1,950', 
            sqft: '620',
            amenities: ['High Ceilings', 'Balcony', 'Stainless Steel Appliances'], 
            image: 'https://picsum.photos/seed/unit201/600/400',
            images: [
              'https://picsum.photos/seed/unit201-1/1200/800',
              'https://picsum.photos/seed/unit201-2/1200/800'
            ]
          }
        ]
      },
      {
        type: '1B1B',
        priceRange: '$2,400 - $2,800',
        sqft: '850 - 950',
        available: 3,
        units: [
          { 
            id: 'Unit 305', 
            price: '$2,450', 
            sqft: '875',
            amenities: ['Walk-in Closet', 'Hardwood Floors', 'In-unit Laundry'], 
            image: 'https://picsum.photos/seed/unit305/600/400',
            images: [
              'https://picsum.photos/seed/unit305-1/1200/800',
              'https://picsum.photos/seed/unit305-2/1200/800'
            ]
          },
          { 
            id: 'Unit 402', 
            price: '$2,600', 
            sqft: '920',
            amenities: ['Penthouse Level', 'Skyline View', 'Private Balcony', 'Chef\'s Kitchen'], 
            image: 'https://picsum.photos/seed/unit402/600/400',
            images: [
              'https://picsum.photos/seed/unit402-1/1200/800',
              'https://picsum.photos/seed/unit402-2/1200/800',
              'https://picsum.photos/seed/unit402-3/1200/800'
            ]
          }
        ]
      }
    ],
    pricingAndFees: {
      rent: 'From $2,400/mo',
      deposit: '$1,000',
      applicationFee: '$50',
      petFee: '$300 (one-time)',
      utilities: 'Water & Trash included'
    }
  },
  {
    id: '2',
    title: 'The Verdant Haven',
    location: 'Los Angeles',
    price: 3800,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    bedsRange: '1 - 2',
    bathsRange: '1 - 2',
    sqftRange: '800 - 1,200',
    image: 'https://picsum.photos/seed/garden-apartment/1200/800',
    images: [
      'https://picsum.photos/seed/garden-apartment/1200/800',
      'https://picsum.photos/seed/apartment-living/1200/800',
      'https://picsum.photos/seed/apartment-garden/1200/800'
    ],
    imageSeed: 'garden-apartment',
    amenities: ['Garden', 'Fireplace', 'Pet Friendly', 'Washer/Dryer'],
    coordinates: { lat: 40.7336, lng: -74.0027 },
    type: 'Apartment',
    description: 'Nestled in a quiet corner, this 2-bedroom apartment features a private garden oasis and restored vintage details combined with modern luxury.',
    rating: 4.8
  },
  {
    id: '3',
    title: 'Minimalist Studio X',
    location: 'Los Angeles',
    price: 1900,
    bedrooms: 0,
    bathrooms: 1,
    sqft: 550,
    bedsRange: 'Studio',
    bathsRange: '1',
    sqftRange: '450 - 550',
    image: 'https://picsum.photos/seed/studio-minimalist/1200/800',
    images: [
      'https://picsum.photos/seed/studio-minimalist/1200/800',
      'https://picsum.photos/seed/studio-bed/1200/800',
      'https://picsum.photos/seed/studio-desk/1200/800'
    ],
    imageSeed: 'studio-minimalist',
    amenities: ['Doorman', 'Roof Deck', 'High Speed Internet'],
    coordinates: { lat: 40.7233, lng: -74.0030 },
    type: 'Studio',
    description: 'Perfect for the modern creative. Clean lines, polished concrete floors, and an efficient layout designed for productivity and rest.',
    rating: 4.7
  },
  {
    id: '4',
    title: 'Aurora Penthouse',
    location: 'Seattle',
    price: 5500,
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2100,
    bedsRange: '2 - 3',
    bathsRange: '2 - 3',
    sqftRange: '1,500 - 2,100',
    image: 'https://picsum.photos/seed/penthouse-luxury/1200/800',
    images: [
      'https://picsum.photos/seed/penthouse-luxury/1200/800',
      'https://picsum.photos/seed/penthouse-view/1200/800',
      'https://picsum.photos/seed/penthouse-bath/1200/800'
    ],
    imageSeed: 'penthouse-luxury',
    amenities: ['Pool', 'Gym', 'Spa', 'Concierge', 'Parking'],
    coordinates: { lat: 40.7580, lng: -73.9855 },
    type: 'Apartment',
    description: 'Experience the height of luxury. This penthouse offers panoramic views, a private spa bathroom, and chef-grade kitchen appliances.',
    rating: 5.0,
    matchReason: 'Redfin: $5000+ budget'
  },
  {
    id: '5',
    title: 'Cozy Brick Townhome',
    location: 'Seattle',
    price: 3200,
    bedrooms: 2,
    bathrooms: 1.5,
    sqft: 1100,
    image: 'https://picsum.photos/seed/townhome-brick/1200/800',
    images: [
      'https://picsum.photos/seed/townhome-brick/1200/800',
      'https://picsum.photos/seed/townhome-living/1200/800',
      'https://picsum.photos/seed/townhome-kitchen/1200/800'
    ],
    imageSeed: 'townhome-brick',
    amenities: ['Fireplace', 'Backyard', 'Quiet'],
    coordinates: { lat: 40.6960, lng: -73.9933 },
    type: 'House',
    description: 'Warm brick walls, hardwood floors, and a cozy fireplace make this townhome the perfect retreat from the bustling city.',
    rating: 4.8
  },
  {
    id: '6',
    title: 'Tech-Forward Flat',
    location: 'Seattle',
    price: 2800,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 900,
    image: 'https://picsum.photos/seed/flat-modern/1200/800',
    images: [
      'https://picsum.photos/seed/flat-modern/1200/800',
      'https://picsum.photos/seed/flat-office/1200/800',
      'https://picsum.photos/seed/flat-bedroom/1200/800'
    ],
    imageSeed: 'flat-modern',
    amenities: ['Smart Home', 'Roof Deck', 'Co-working Space'],
    coordinates: { lat: 40.7178, lng: -73.9574 },
    type: 'Apartment',
    description: 'Designed for the remote worker. Includes a built-in office nook, gigabit internet, and access to the building\'s exclusive co-working lounge.',
    rating: 4.6
  },
  {
    id: '7',
    title: 'Sunny Corner Unit',
    location: 'Chicago',
    price: 4100,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1300,
    image: 'https://picsum.photos/seed/apartment-sunny/1200/800',
    images: [
      'https://picsum.photos/seed/apartment-sunny/1200/800',
      'https://picsum.photos/seed/apartment-living/1200/800',
      'https://picsum.photos/seed/apartment-kitchen/1200/800'
    ],
    imageSeed: 'apartment-sunny',
    amenities: ['Doorman', 'Near Park', 'Dishwasher'],
    coordinates: { lat: 40.7870, lng: -73.9754 },
    type: 'Apartment',
    description: 'Bathed in natural light, this corner unit is steps away from Central Park. Classic pre-war architecture meets modern renovation.',
    rating: 4.9
  },
  {
    id: '8',
    title: 'Artist Loft 404',
    location: 'Chicago',
    price: 2100,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 1000,
    image: 'https://picsum.photos/seed/loft-artist/1200/800',
    images: [
      'https://picsum.photos/seed/loft-artist/1200/800',
      'https://picsum.photos/seed/loft-industrial/1200/800',
      'https://picsum.photos/seed/loft-studio/1200/800'
    ],
    imageSeed: 'loft-artist',
    amenities: ['High Ceilings', 'Open Plan', 'Freight Elevator'],
    coordinates: { lat: 40.7006, lng: -73.9262 },
    type: 'Loft',
    description: 'A true artist\'s loft with 14ft ceilings and massive industrial windows. An inspiring blank canvas for your lifestyle.',
    rating: 4.5
  },
  {
    id: '9',
    title: 'River View Residence',
    location: 'Chicago',
    price: 3400,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1150,
    image: 'https://picsum.photos/seed/apartment-river/1200/800',
    images: [
      'https://picsum.photos/seed/apartment-river/1200/800',
      'https://picsum.photos/seed/apartment-view/1200/800',
      'https://picsum.photos/seed/apartment-balcony/1200/800'
    ],
    imageSeed: 'apartment-river',
    amenities: ['Water View', 'Gym', 'Parking', 'Balcony'],
    coordinates: { lat: 40.7447, lng: -73.9485 },
    type: 'Apartment',
    description: 'Enjoy stunning sunsets over the East River. This modern high-rise apartment offers resort-style amenities and quick access to Manhattan.',
    rating: 4.7
  },
  {
    id: '10',
    title: 'The Glass Box',
    location: 'Houston',
    price: 6500,
    bedrooms: 3,
    bathrooms: 3.5,
    sqft: 2400,
    image: 'https://picsum.photos/seed/apartment-glass/1200/800',
    images: [
      'https://picsum.photos/seed/apartment-glass/1200/800',
      'https://picsum.photos/seed/apartment-luxury/1200/800',
      'https://picsum.photos/seed/apartment-terrace/1200/800'
    ],
    imageSeed: 'apartment-glass',
    amenities: ['Private Elevator', 'Terrace', 'Wine Cooler', 'Concierge'],
    coordinates: { lat: 40.7163, lng: -74.0086 },
    type: 'Apartment',
    description: 'Architectural masterpiece. Floor-to-ceiling glass walls, imported stone finishes, and a massive private terrace for entertaining.',
    rating: 5.0
  },
  {
    id: '11',
    title: 'Midtown Oasis',
    location: 'Houston',
    price: 3100,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 750,
    image: 'https://picsum.photos/seed/apartment-oasis/1200/800',
    images: [
      'https://picsum.photos/seed/apartment-oasis/1200/800',
      'https://picsum.photos/seed/apartment-interior/1200/800',
      'https://picsum.photos/seed/apartment-gym/1200/800'
    ],
    imageSeed: 'apartment-oasis',
    amenities: ['Gym', 'Doorman', 'Roof Deck'],
    coordinates: { lat: 40.7638, lng: -73.9918 },
    type: 'Apartment',
    description: 'A quiet sanctuary in the heart of the action. Features soundproof windows, hardwood floors, and a modern kitchen with granite countertops.',
    rating: 4.6
  },
  {
    id: '12',
    title: 'Historic Harlem Brownstone',
    location: 'Houston',
    price: 2600,
    bedrooms: 2,
    bathrooms: 1,
    sqft: 1000,
    image: 'https://picsum.photos/seed/brownstone-historic/1200/800',
    images: [
      'https://picsum.photos/seed/brownstone-historic/1200/800',
      'https://picsum.photos/seed/brownstone-living/1200/800',
      'https://picsum.photos/seed/brownstone-bedroom/1200/800'
    ],
    imageSeed: 'brownstone-historic',
    amenities: ['Fireplace', 'High Ceilings', 'Original Details'],
    coordinates: { lat: 40.8116, lng: -73.9465 },
    type: 'House',
    description: 'Beautifully preserved brownstone floor-through apartment. Soaring ceilings, decorative fireplaces, and sun-drenched rooms.',
    rating: 4.7
  },
  {
    id: '13',
    title: 'Financial District Suite',
    location: 'Irvine',
    price: 3500,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 800,
    image: 'https://picsum.photos/seed/apartment-financial/1200/800',
    images: [
      'https://picsum.photos/seed/apartment-financial/1200/800',
      'https://picsum.photos/seed/apartment-suite/1200/800',
      'https://picsum.photos/seed/apartment-lobby/1200/800'
    ],
    imageSeed: 'apartment-financial',
    amenities: ['Concierge', 'Gym', 'Lounge', 'Laundry in Building'],
    coordinates: { lat: 40.7074, lng: -74.0113 },
    type: 'Apartment',
    description: 'Live in a converted bank building with incredible architectural details. Modern finishes meet historic charm. Close to all major subway lines.',
    rating: 4.5
  },
  {
    id: '14',
    title: 'Bohemian East Village Studio',
    location: 'Irvine',
    price: 2200,
    bedrooms: 0,
    bathrooms: 1,
    sqft: 450,
    image: 'https://picsum.photos/seed/studio-bohemian/1200/800',
    images: [
      'https://picsum.photos/seed/studio-bohemian/1200/800',
      'https://picsum.photos/seed/studio-garden/1200/800',
      'https://picsum.photos/seed/studio-brick/1200/800'
    ],
    imageSeed: 'studio-bohemian',
    amenities: ['Shared Garden', 'Exposed Brick'],
    coordinates: { lat: 40.7265, lng: -73.9815 },
    type: 'Studio',
    description: 'Charming studio with exposed brick walls and access to a lush shared garden. Steps away from the best cafes and nightlife in the city.',
    rating: 4.4
  },
  {
    id: '15',
    title: 'Park Slope Family Home',
    location: 'Irvine',
    price: 4500,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1600,
    image: 'https://picsum.photos/seed/house-family/1200/800',
    images: [
      'https://picsum.photos/seed/house-family/1200/800',
      'https://picsum.photos/seed/house-backyard/1200/800',
      'https://picsum.photos/seed/house-kitchen/1200/800'
    ],
    imageSeed: 'house-family',
    amenities: ['Backyard', 'Washer/Dryer', 'Near Park', 'Storage'],
    coordinates: { lat: 40.6711, lng: -73.9783 },
    type: 'House',
    description: 'Spacious floor-through apartment in a classic limestone building. Features a large private backyard perfect for families and entertaining.',
    rating: 4.9
  },
  {
    id: '16',
    title: 'DUMBO Industrial Loft',
    location: 'New York',
    price: 5200,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1400,
    image: 'https://picsum.photos/seed/loft-industrial/1200/800',
    images: [
      'https://picsum.photos/seed/loft-industrial/1200/800',
      'https://picsum.photos/seed/loft-view/1200/800',
      'https://picsum.photos/seed/loft-kitchen/1200/800'
    ],
    imageSeed: 'loft-industrial',
    amenities: ['Water View', 'Gym', 'Roof Deck', 'Elevator'],
    coordinates: { lat: 40.7033, lng: -73.9881 },
    type: 'Loft',
    description: 'Authentic loft living with cobblestone street views. Concrete beams, high ceilings, and top-of-the-line appliances.',
    rating: 4.8
  },
  {
    id: '17',
    title: 'Hudson River View',
    location: 'New York',
    price: 3900,
    bedrooms: 1,
    bathrooms: 1.5,
    sqft: 950,
    image: 'https://picsum.photos/seed/apartment-river/1200/800',
    images: [
      'https://picsum.photos/seed/apartment-river/1200/800',
      'https://picsum.photos/seed/apartment-view/1200/800',
      'https://picsum.photos/seed/apartment-pool/1200/800'
    ],
    imageSeed: 'apartment-river',
    amenities: ['Water View', 'Pool', 'Gym', 'Doorman'],
    coordinates: { lat: 40.7117, lng: -74.0163 },
    type: 'Apartment',
    description: 'Tranquil living right on the water. Watch the boats go by from your living room. Luxury building with full amenities.',
    rating: 4.7
  },
  {
    id: '18',
    title: 'Chelsea Art District Penthouse',
    location: 'New York',
    price: 7200,
    bedrooms: 2,
    bathrooms: 2.5,
    sqft: 1800,
    image: 'https://picsum.photos/seed/penthouse-terrace/1200/800',
    images: [
      'https://picsum.photos/seed/penthouse-terrace/1200/800',
      'https://picsum.photos/seed/penthouse-interior/1200/800',
      'https://picsum.photos/seed/penthouse-fireplace/1200/800'
    ],
    imageSeed: 'penthouse-terrace',
    amenities: ['Terrace', 'Fireplace', 'Doorman', 'Art Gallery View'],
    coordinates: { lat: 40.7465, lng: -74.0014 },
    type: 'Apartment',
    description: 'Stunning penthouse with a wrap-around terrace. Located in the heart of the art district, featuring gallery-style lighting and walls.',
    rating: 5.0
  },
  {
    id: '19',
    title: 'Cobble Hill Garden Flat',
    location: 'New York',
    price: 2900,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 700,
    image: 'https://picsum.photos/seed/apartment-garden/1200/800',
    images: [
      'https://picsum.photos/seed/apartment-garden/1200/800',
      'https://picsum.photos/seed/apartment-flat/1200/800',
      'https://picsum.photos/seed/apartment-quiet/1200/800'
    ],
    imageSeed: 'apartment-garden',
    amenities: ['Garden', 'Pet Friendly', 'Quiet'],
    coordinates: { lat: 40.6886, lng: -73.9940 },
    type: 'Apartment',
    description: 'A rare find in a historic neighborhood. Direct access to a shared garden and located on a whisper-quiet tree-lined street.',
    rating: 4.8
  },
  {
    id: '20',
    title: 'Classic Upper East Side',
    location: 'New York',
    price: 3300,
    bedrooms: 2,
    bathrooms: 1,
    sqft: 1100,
    image: 'https://picsum.photos/seed/apartment-classic/1200/800',
    images: [
      'https://picsum.photos/seed/apartment-classic/1200/800',
      'https://picsum.photos/seed/apartment-interior/1200/800',
      'https://picsum.photos/seed/apartment-lobby/1200/800'
    ],
    imageSeed: 'apartment-classic',
    amenities: ['Doorman', 'Near Park', 'Elevator'],
    coordinates: { lat: 40.7736, lng: -73.9566 },
    type: 'Apartment',
    description: 'Elegance defined. Pre-war moldings, hardwood floors, and just a short walk to Central Park and the Museum Mile.',
    rating: 4.6
  }
];

export const PLACEHOLDER_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix";
export const AI_AVATAR = "https://api.dicebear.com/7.x/bottts/svg?seed=Lumina";

// Single persistent conversation thread — all sessions share one history
export const PERSISTENT_THREAD_ID = 'main';

export const SUGGESTION_CHIPS = [
  { 
    label: 'Modern Loft', 
    icon: 'Square', 
    query: 'Find me a modern loft with high ceilings and an open floor plan.',
    image: 'https://picsum.photos/seed/loft-vibe/400/250'
  },
  { 
    label: 'Garden Oasis', 
    icon: 'TreePine', 
    query: 'I want a home with a private garden or a large backyard.',
    image: 'https://picsum.photos/seed/garden-vibe/400/250'
  },
  { 
    label: 'Pet Friendly', 
    icon: 'Music', 
    query: 'Show me pet-friendly apartments with nearby parks.',
    image: 'https://picsum.photos/seed/pet-vibe/400/250'
  },
  { 
    label: 'Skyline Views', 
    icon: 'Sun', 
    query: 'Looking for a high-floor unit with panoramic city skyline views.',
    image: 'https://picsum.photos/seed/skyline-vibe/400/250'
  },
];
export interface CostItem {
  item: string;
  cost: string;
}

export interface TravelOption {
  type: 'Budget' | 'Medium' | 'Luxury';
  costUSD: string;
  costINR: string;
  time: string;
  transportType: string;
  routeSteps: string[];
  isBestChoice?: boolean;
  detailedExplanation: string;
  precautions: string[];
  costBreakdown: CostItem[];
}

export interface PopularPlace {
  name: string;
  description: string;
}

export interface TravelData {
  popularPlaces: PopularPlace[];
}

export async function getPopularPlaces(state: string, city: string): Promise<PopularPlace[]> {
  // Simulate network delay to maintain the UI feel
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return [
    {
      name: `Historic Downtown ${city}`,
      description: `Experience the rich history and vibrant culture in the heart of ${city}, ${state}.`
    },
    {
      name: `${city} Central Park`,
      description: `A beautiful green space right in the middle of ${city}, perfect for a relaxing afternoon.`
    },
    {
      name: `The Grand Museum of ${state}`,
      description: `Explore fascinating exhibits showcasing the art, history, and science of the region.`
    },
    {
      name: `${city} Waterfront`,
      description: `Enjoy stunning views, great dining, and entertaining activities along the scenic waterfront.`
    }
  ];
}

export async function getTravelOptions(state: string, city: string, destination: string, startLocation: string): Promise<TravelOption[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  return [
    {
      type: 'Budget',
      costUSD: '$5',
      costINR: '₹400',
      time: '45 mins',
      transportType: 'Public Transport',
      routeSteps: [
        `Walk to the nearest transit stop from ${startLocation}.`,
        `Take the main bus route towards the city center.`,
        `Alight at the stop near ${destination}.`,
        `Walk 5 mins to your final destination.`
      ],
      isBestChoice: false,
      detailedExplanation: 'This is the most economical way to travel, giving you an authentic experience of the city’s public transit system while saving money.',
      precautions: [
        'Keep your belongings secure in crowded areas.',
        'Have exact change or a travel card ready.',
        'Check transit timings which may vary by time of day.'
      ],
      costBreakdown: [
        { item: 'Transit Ticket', cost: '₹50' },
        { item: 'Local Snacks', cost: '₹150' },
        { item: 'Miscellaneous Backup', cost: '₹200' }
      ]
    },
    {
      type: 'Medium',
      costUSD: '$12',
      costINR: '₹1000',
      time: '25 mins',
      transportType: 'Taxi / Ride-hailing',
      routeSteps: [
        `Book a cab or ride-share from ${startLocation}.`,
        `Enjoy a direct commute bypassing major transit hubs to ${destination}.`,
        `Arrive comfortably at the entrance without needing to walk far.`
      ],
      isBestChoice: true,
      detailedExplanation: 'A great balance between cost and comfort. Faster than public transport without having to pay the premium luxury price tag.',
      precautions: [
        'Check the fare estimate before booking your ride.',
        'Ensure the driver takes the shortest route displayed on maps.',
        'Keep traffic conditions in mind.'
      ],
      costBreakdown: [
        { item: 'Estimated Cab Fare', cost: '₹1000' }
      ]
    },
    {
      type: 'Luxury',
      costUSD: '$35',
      costINR: '₹3000',
      time: '20 mins',
      transportType: 'Premium Private Car',
      routeSteps: [
        `Chauffeur picks you up directly at ${startLocation} in a premium vehicle.`,
        `Travel with absolute privacy, comfort, and direct routing.`,
        `Get dropped off directly at the VIP or main entrance of ${destination}.`
      ],
      isBestChoice: false,
      detailedExplanation: 'The premium travel option focusing entirely on luxury, privacy, and maximum speed. Perfect for those who want the best experience without worrying about costs.',
      precautions: [
        'Pre-book well in advance to ensure availability.',
        'Communicate any special requests to your service provider in advance.'
      ],
      costBreakdown: [
        { item: 'Premium Vehicle Base Fare', cost: '₹2500' },
        { item: 'Convenience Fees', cost: '₹200' },
        { item: 'Chauffeur Tip (Optional)', cost: '₹300' }
      ]
    }
  ];
}

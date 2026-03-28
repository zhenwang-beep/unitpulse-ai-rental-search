import { Property, SearchFilters } from '../types';
import { MOCK_PROPERTIES } from '../constants';

export const getFilteredProperties = (filters: SearchFilters): Property[] => {
  const results = MOCK_PROPERTIES.filter(property => {
    let matches = true;

    if (filters.location && filters.location !== 'All') {
      matches = matches && property.location.toLowerCase().includes(filters.location.toLowerCase());
    }
    if (filters.minPrice) {
      matches = matches && property.price >= filters.minPrice;
    }
    if (filters.maxPrice) {
      matches = matches && property.price <= filters.maxPrice;
    }
    if (filters.minBedrooms) {
      matches = matches && property.bedrooms >= filters.minBedrooms;
    }
    if (filters.propertyType) {
      matches = matches && property.type.toLowerCase().includes(filters.propertyType.toLowerCase());
    }

    return matches;
  }).map(property => {
    // Calculate a pseudo match score based on amenities and other factors
    let score = 85 + Math.floor(Math.random() * 10); // Base score 85-95
    
    if (filters.amenities && filters.amenities.length > 0) {
      const propertyAmenitiesLower = property.amenities.map(a => a.toLowerCase());
      const requestedAmenitiesLower = filters.amenities.map(a => a.toLowerCase());
      const matches = requestedAmenitiesLower.filter(req => 
        propertyAmenitiesLower.some(prop => prop.includes(req))
      ).length;
      
      score += (matches / requestedAmenitiesLower.length) * 5;
    }

    return { ...property, matchScore: Math.min(Math.round(score), 99) };
  });

  return results.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
};
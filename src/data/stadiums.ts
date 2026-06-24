import type { Stadium } from '../types'

export const STADIUMS: Record<string, Stadium> = {
  mexico_city: { id: 'mexico_city', name: 'Estadio Azteca', city: 'Mexico City', country: 'Mexico', capacity: 87523 },
  zapopan: { id: 'zapopan', name: 'Estadio Akron', city: 'Zapopan', country: 'Mexico', capacity: 49850 },
  guadalupe: { id: 'guadalupe', name: 'Estadio BBVA', city: 'Guadalupe', country: 'Mexico', capacity: 53500 },
  toronto: { id: 'toronto', name: 'BMO Field', city: 'Toronto', country: 'Canada', capacity: 45736 },
  vancouver: { id: 'vancouver', name: 'BC Place', city: 'Vancouver', country: 'Canada', capacity: 54500 },
  los_angeles: { id: 'los_angeles', name: 'SoFi Stadium', city: 'Los Angeles', country: 'USA', capacity: 70240 },
  santa_clara: { id: 'santa_clara', name: 'Levi\'s Stadium', city: 'Santa Clara', country: 'USA', capacity: 68500 },
  new_jersey: { id: 'new_jersey', name: 'MetLife Stadium', city: 'East Rutherford', country: 'USA', capacity: 82500 },
  foxborough: { id: 'foxborough', name: 'Gillette Stadium', city: 'Foxborough', country: 'USA', capacity: 65878 },
  houston: { id: 'houston', name: 'NRG Stadium', city: 'Houston', country: 'USA', capacity: 72220 },
  arlington: { id: 'arlington', name: 'AT&T Stadium', city: 'Arlington', country: 'USA', capacity: 80000 },
  philadelphia: { id: 'philadelphia', name: 'Lincoln Financial Field', city: 'Philadelphia', country: 'USA', capacity: 69796 },
  atlanta: { id: 'atlanta', name: 'Mercedes-Benz Stadium', city: 'Atlanta', country: 'USA', capacity: 71000 },
  seattle: { id: 'seattle', name: 'Lumen Field', city: 'Seattle', country: 'USA', capacity: 69000 },
  miami: { id: 'miami', name: 'Hard Rock Stadium', city: 'Miami Gardens', country: 'USA', capacity: 65326 },
  kansas_city: { id: 'kansas_city', name: 'Arrowhead Stadium', city: 'Kansas City', country: 'USA', capacity: 76416 },
  dallas: { id: 'dallas', name: 'AT&T Stadium', city: 'Dallas', country: 'USA', capacity: 80000 },
  boston: { id: 'boston', name: 'Gillette Stadium', city: 'Foxborough', country: 'USA', capacity: 65878 },
}

export function getStadium(id: string): Stadium {
  return STADIUMS[id] ?? { id, name: 'TBD', city: 'TBD', country: 'USA', capacity: 0 }
}

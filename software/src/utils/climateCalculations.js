// Utility functions for environmental calculations, metrics, and room configurations

/**
 * Calculates Heat Index in Celsius based on NOAA formula approximation
 */
export function calculateHeatIndex(tempC, humidity) {
  if (tempC < 20) return tempC; // Heat index only meaningful above ~20C
  const T = (tempC * 9/5) + 32; // Fahrenheit
  const R = humidity;

  // Rothfusz regression equation
  let hi = -42.379 + 2.04901523*T + 10.14333127*R - 0.22475541*T*R 
    - 0.00683783*T*T - 0.05481717*R*R + 0.00122874*T*T*R 
    + 0.00085282*T*R*R - 0.00000199*T*T*R*R;

  return ((hi - 32) * 5/9);
}

/**
 * Categorizes Air Quality based on CO2 ppm
 */
export function getAirQualityStatus(co2) {
  if (co2 < 700) {
    return { label: 'Excellent', level: 'good', color: 'emerald', badge: 'Fresh Air' };
  } else if (co2 < 1000) {
    return { label: 'Good', level: 'moderate', color: 'blue', badge: 'Normal Indoor' };
  } else if (co2 < 1400) {
    return { label: 'Stuffy', level: 'stuffy', color: 'amber', badge: 'Ventilation Needed' };
  } else {
    return { label: 'Poor', level: 'poor', color: 'rose', badge: 'High CO2 Alert' };
  }
}

/**
 * Categorizes Thermal Comfort
 */
export function getComfortStatus(tempC) {
  if (tempC < 20.0) {
    return { label: 'Cold', color: 'blue', desc: 'Chilly, heating or warm layers recommended' };
  } else if (tempC < 22.0) {
    return { label: 'Cool', color: 'cyan', desc: 'Mild cool, comfortable for active study' };
  } else if (tempC <= 25.0) {
    return { label: 'Optimal', color: 'emerald', desc: 'Ideal zone for focus and sleep' };
  } else if (tempC <= 27.0) {
    return { label: 'Warm', color: 'amber', desc: 'Warm, localized airflow recommended' };
  } else {
    return { label: 'Hot', color: 'rose', desc: 'Uncomfortably hot, active cooling required' };
  }
}

/**
 * Predefined room configurations for 2, 4, and 6 sharing dorms
 */
export const ROOM_PRESETS = {
  2: {
    name: '2-Occupant Bunk Room',
    description: 'Standard double occupancy bunk bed layout with vertical monitoring',
    nodes: [
      { id: 'bunk1-top', name: 'Bed 1 (Top Bunk)', ip: '', bunk: 'top', bedNum: 1, x: 22, y: 30 },
      { id: 'bunk1-bottom', name: 'Bed 2 (Bottom Bunk)', ip: '', bunk: 'bottom', bedNum: 2, x: 22, y: 70 },
    ],
  },
  4: {
    name: '4-Occupant Suite',
    description: 'Quad dorm room with two twin bunk setups across the room',
    nodes: [
      { id: 'bunk1-top', name: 'Bed 1 (Bunk A - Top)', ip: '', bunk: 'top', bedNum: 1, x: 20, y: 28 },
      { id: 'bunk1-bottom', name: 'Bed 2 (Bunk A - Bottom)', ip: '', bunk: 'bottom', bedNum: 2, x: 20, y: 72 },
      { id: 'bunk2-top', name: 'Bed 3 (Bunk B - Top)', ip: '', bunk: 'top', bedNum: 3, x: 80, y: 28 },
      { id: 'bunk2-bottom', name: 'Bed 4 (Bunk B - Bottom)', ip: '', bunk: 'bottom', bedNum: 4, x: 80, y: 72 },
    ],
  },
  6: {
    name: '6-Occupant Dorm Hall',
    description: 'Large six-person dorm room with three bunk zones',
    nodes: [
      { id: 'bunk1-top', name: 'Bed 1 (Bunk A - Top)', ip: '', bunk: 'top', bedNum: 1, x: 18, y: 28 },
      { id: 'bunk1-bottom', name: 'Bed 2 (Bunk A - Bottom)', ip: '', bunk: 'bottom', bedNum: 2, x: 18, y: 72 },
      { id: 'bunk2-top', name: 'Bed 3 (Bunk B - Top)', ip: '', bunk: 'top', bedNum: 3, x: 50, y: 28 },
      { id: 'bunk2-bottom', name: 'Bed 4 (Bunk B - Bottom)', ip: '', bunk: 'bottom', bedNum: 4, x: 50, y: 72 },
      { id: 'bunk3-top', name: 'Bed 5 (Bunk C - Top)', ip: '', bunk: 'top', bedNum: 5, x: 82, y: 28 },
      { id: 'bunk3-bottom', name: 'Bed 6 (Bunk C - Bottom)', ip: '', bunk: 'bottom', bedNum: 6, x: 82, y: 72 },
    ],
  },
};

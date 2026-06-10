interface CityData {
  name: string;
  state: string;
  lat: number;
  lng: number;
  alt: string[];
}

export const INDIAN_CITIES: CityData[] = [
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, alt: ['bombay', 'mumbay', 'navi mumbai', 'thane', 'kalyan', 'dombivli'] },
  { name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946, alt: ['bangalore', 'bengaluru', 'bengalooru', 'bengluru', 'koramangala', 'indiranagar', 'whitefield'] },
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, alt: ['madras', 'chennay', 'adyar', 'mylapore'] },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, alt: ['calcutta', 'kolkata', 'calcuta', 'howrah'] },
  { name: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090, alt: ['new delhi', 'delhi', 'dehli', 'dilli', 'dwarka', 'connaught place'] },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867, alt: ['secunderabad', 'hderabad', 'cyberabad'] },
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, alt: ['poona', 'punya', 'chinchwad', 'pimpri'] },
  { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714, alt: ['ahmedabad', 'amdavad'] },
  { name: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311, alt: ['surat'] },
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, alt: ['jaipur', 'pink city'] },
  { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, alt: ['lucknow', 'lakhnau'] },
  { name: 'Kanpur', state: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319, alt: ['cawnpore', 'kanpur'] },
  { name: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882, alt: ['nagpur', 'orange city'] },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185, alt: ['vizag', 'visakhapatnam', 'waltair'] },
  { name: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577, alt: ['indore'] },
  { name: 'Thane', state: 'Maharashtra', lat: 19.2183, lng: 72.9781, alt: ['thane'] },
  { name: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126, alt: ['bhopal'] },
  { name: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376, alt: ['patna', 'pataliputra'] },
  { name: 'Vadodara', state: 'Gujarat', lat: 22.3072, lng: 73.1812, alt: ['baroda', 'vadodara'] },
  { name: 'Ghaziabad', state: 'Uttar Pradesh', lat: 28.6692, lng: 77.4538, alt: ['ghaziabad'] },
  { name: 'Ludhiana', state: 'Punjab', lat: 30.9010, lng: 75.8573, alt: ['ludhiana'] },
  { name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558, alt: ['kovai', 'coimbatore'] },
  { name: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081, alt: ['agra', 'taj city'] },
  { name: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198, alt: ['madurai', 'temple city'] },
  { name: 'Nashik', state: 'Maharashtra', lat: 19.9975, lng: 73.7898, alt: ['nasik', 'nashik'] },
  { name: 'Faridabad', state: 'Haryana', lat: 28.4089, lng: 77.3178, alt: ['faridabad'] },
  { name: 'Meerut', state: 'Uttar Pradesh', lat: 28.9845, lng: 77.7064, alt: ['meerut'] },
  { name: 'Rajkot', state: 'Gujarat', lat: 22.3039, lng: 70.8022, alt: ['rajkot'] },
  { name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 83.0062, alt: ['benares', 'banaras', 'kashi', 'varanasi'] },
  { name: 'Srinagar', state: 'Jammu and Kashmir', lat: 34.0837, lng: 74.7973, alt: ['srinagar'] },
  { name: 'Aurangabad', state: 'Maharashtra', lat: 19.8762, lng: 75.3433, alt: ['aurangabad', 'chhatrapati sambhajinagar'] },
  { name: 'Amritsar', state: 'Punjab', lat: 31.6340, lng: 74.8723, alt: ['amritsar'] },
  { name: 'Prayagraj', state: 'Uttar Pradesh', lat: 25.4358, lng: 81.8463, alt: ['allahabad', 'prayag', 'prayagraj'] },
  { name: 'Howrah', state: 'West Bengal', lat: 22.5958, lng: 88.2636, alt: ['howrah', 'haora'] },
  { name: 'Ranchi', state: 'Jharkhand', lat: 23.3441, lng: 85.3096, alt: ['ranchi'] },
  { name: 'Gwalior', state: 'Madhya Pradesh', lat: 26.2183, lng: 78.1828, alt: ['gwalior'] },
  { name: 'Jabalpur', state: 'Madhya Pradesh', lat: 23.1815, lng: 79.9864, alt: ['jabalpur'] },
  { name: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.5062, lng: 80.6480, alt: ['bezawada', 'vijayawada'] },
  { name: 'Jodhpur', state: 'Rajasthan', lat: 26.2389, lng: 73.0243, alt: ['jodhpur', 'blue city'] },
  { name: 'Raipur', state: 'Chhattisgarh', lat: 21.2514, lng: 81.6296, alt: ['raipur'] },
  { name: 'Kota', state: 'Rajasthan', lat: 25.2138, lng: 75.8648, alt: ['kota'] },
  { name: 'Guwahati', state: 'Assam', lat: 26.1445, lng: 91.7362, alt: ['gauhati', 'guwahati'] },
  { name: 'Chandigarh', state: 'Punjab', lat: 30.7333, lng: 76.7794, alt: ['chandigarh'] },
  { name: 'Mysore', state: 'Karnataka', lat: 12.2958, lng: 76.6394, alt: ['mysuru', 'mysore'] },
  { name: 'Gurugram', state: 'Haryana', lat: 28.4595, lng: 77.0266, alt: ['gurgaon', 'gurugram'] },
  { name: 'Bhubaneswar', state: 'Odisha', lat: 20.2961, lng: 85.8245, alt: ['bhubaneswar'] },
  { name: 'Salem', state: 'Tamil Nadu', lat: 11.6643, lng: 78.1460, alt: ['salem'] },
  { name: 'Noida', state: 'Uttar Pradesh', lat: 28.5355, lng: 77.3910, alt: ['noida'] },
  { name: 'Tiruchirappalli', state: 'Tamil Nadu', lat: 10.7905, lng: 78.7047, alt: ['trichy', 'tiruchirappalli', 'tiruchy'] },
  { name: 'Puducherry', state: 'Puducherry', lat: 11.9416, lng: 79.8083, alt: ['pondicherry', 'pondy', 'puducherry'] },
  { name: 'Dehradun', state: 'Uttarakhand', lat: 30.3165, lng: 78.0322, alt: ['dehradun', 'doon'] },
  { name: 'Udaipur', state: 'Rajasthan', lat: 24.5854, lng: 73.7125, alt: ['udaipur'] },
  { name: 'Gandhinagar', state: 'Gujarat', lat: 23.2156, lng: 72.6369, alt: ['gandhinagar'] },
  { name: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673, alt: ['cochin', 'kochi', 'ernakulam'] },
  { name: 'Kozhikode', state: 'Kerala', lat: 11.2588, lng: 75.7804, alt: ['calicut', 'kozhikode'] },
  { name: 'Thiruvananthapuram', state: 'Kerala', lat: 8.5241, lng: 76.9366, alt: ['trivandrum', 'thiruvananthapuram'] },
  { name: 'Mangaluru', state: 'Karnataka', lat: 12.9141, lng: 74.8560, alt: ['mangalore', 'mangaluru'] },
  { name: 'Belagavi', state: 'Karnataka', lat: 15.8497, lng: 74.4977, alt: ['belgaum', 'belagavi'] },
  { name: 'Ooty', state: 'Tamil Nadu', lat: 11.4102, lng: 76.6950, alt: ['ooty', 'ootacamund', 'udhagamandalam'] },
  { name: 'Panaji', state: 'Goa', lat: 15.4909, lng: 73.8278, alt: ['panjim', 'panaji'] },
  { name: 'Shimla', state: 'Himachal Pradesh', lat: 31.1048, lng: 77.1734, alt: ['simla', 'shimla'] },
  { name: 'Siliguri', state: 'West Bengal', lat: 26.7271, lng: 88.3953, alt: ['siliguri'] },
  { name: 'Jammu', state: 'Jammu and Kashmir', lat: 32.7266, lng: 74.8570, alt: ['jammu'] },
  { name: 'Nellore', state: 'Andhra Pradesh', lat: 14.4426, lng: 79.9865, alt: ['nellore'] },
  { name: 'Ujjain', state: 'Madhya Pradesh', lat: 23.1760, lng: 75.7885, alt: ['ujjain'] },
  { name: 'Warangal', state: 'Telangana', lat: 17.9784, lng: 79.5941, alt: ['warangal'] },
  { name: 'Guntur', state: 'Andhra Pradesh', lat: 16.3067, lng: 80.4365, alt: ['guntur'] },
  { name: 'Jhansi', state: 'Uttar Pradesh', lat: 25.4484, lng: 78.5685, alt: ['jhansi'] },
  { name: 'Jalandhar', state: 'Punjab', lat: 31.3260, lng: 75.5762, alt: ['jalandhar'] },
  { name: 'Aligarh', state: 'Uttar Pradesh', lat: 27.8837, lng: 78.0800, alt: ['aligarh'] }
];

// Calculate Levenshtein distance between two strings
function getLevenshteinDistance(a: string, b: string): number {
  const tmp = [];
  let i, j;
  for (i = 0; i <= a.length; i++) {
    tmp.push([i]);
  }
  for (j = 1; j <= b.length; j++) {
    tmp[0].push(j);
  }
  for (i = 1; i <= a.length; i++) {
    for (j = 1; j <= b.length; j++) {
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1,
        tmp[i][j - 1] + 1,
        tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return tmp[a.length][b.length];
}

// Compute similarity score between 0 and 1
function getSimilarity(a: string, b: string): number {
  const distance = getLevenshteinDistance(a, b);
  const maxLength = Math.max(a.length, b.length);
  if (maxLength === 0) return 1.0;
  return 1.0 - distance / maxLength;
}

// Normalize strings for matching
function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

export function searchLocalIndianCities(query: string) {
  const normQuery = normalize(query);
  if (!normQuery) return [];

  let matches: { city: CityData; score: number }[] = [];

  for (const city of INDIAN_CITIES) {
    const normName = normalize(city.name);
    let bestScore = 0;

    // 1. Exact match on official name
    if (normQuery === normName) {
      bestScore = 1.0;
    } else {
      // 2. Substring matching (contains or is contained in)
      if (normName.includes(normQuery) || normQuery.includes(normName)) {
        const overlap = Math.min(normName.length, normQuery.length) / Math.max(normName.length, normQuery.length);
        // Boost score for substring matches
        bestScore = Math.max(bestScore, 0.7 + overlap * 0.2);
      }

      // 3. Fuzzy similarity check on official name
      const fuzzySim = getSimilarity(normQuery, normName);
      bestScore = Math.max(bestScore, fuzzySim);
    }

    // 4. Check alternative / old names
    for (const alt of city.alt) {
      const normAlt = normalize(alt);
      if (normQuery === normAlt) {
        bestScore = Math.max(bestScore, 1.0);
      } else {
        if (normAlt.includes(normQuery) || normQuery.includes(normAlt)) {
          const overlap = Math.min(normAlt.length, normQuery.length) / Math.max(normAlt.length, normQuery.length);
          bestScore = Math.max(bestScore, 0.7 + overlap * 0.2);
        }
        const fuzzySim = getSimilarity(normQuery, normAlt);
        bestScore = Math.max(bestScore, fuzzySim);
      }
    }

    // If matches state name, give a small boost
    const normState = normalize(city.state);
    if (normQuery.includes(normState)) {
      bestScore = Math.max(bestScore, 0.5); // base score for state match
    }

    if (bestScore >= 0.75) {
      matches.push({ city, score: bestScore });
    }
  }

  // Sort matches by score descending
  matches.sort((a, b) => b.score - a.score);

  // If no high-confidence match in the curated list, fall back to the massive dataset
  if (matches.length === 0 || matches[0].score < 0.85) {
    // Import massive data lazy-loaded to prevent memory hit until needed
    const massiveCitiesData = require('./indian-cities-data.json');
    for (const city of massiveCitiesData) {
      const normName = normalize(city.name);
      
      // Early exit based on length difference to speed up 7000 calculations
      if (Math.abs(normName.length - normQuery.length) > Math.max(3, normQuery.length * 0.4)) {
        continue;
      }

      let bestScore = 0;
      if (normQuery === normName) {
        bestScore = 1.0;
      } else if (normName.includes(normQuery) || normQuery.includes(normName)) {
        const overlap = Math.min(normName.length, normQuery.length) / Math.max(normName.length, normQuery.length);
        bestScore = 0.7 + overlap * 0.2;
      } else {
        bestScore = getSimilarity(normQuery, normName);
      }

      if (bestScore >= 0.75) {
        matches.push({ city: { ...city, state: '', alt: [] }, score: bestScore });
      }
    }
    
    // Resort matches
    matches.sort((a, b) => b.score - a.score);
  }

  // Deduplicate by name
  const uniqueMatches = Array.from(new Map(matches.map(item => [item.city.name, item])).values());

  // Return mapped to Nominatim format
  return uniqueMatches.slice(0, 5).map(({ city }) => ({
    place_id: Math.floor(Math.random() * 10000000),
    licence: 'Data © Local Indian Geocoding Database (Free & Open Source)',
    lat: city.lat.toString(),
    lon: city.lng.toString(),
    display_name: `${city.name}${city.state ? ', ' + city.state : ''}, India`,
    address: {
      city: city.name,
      state: city.state || undefined,
      country: 'India',
      country_code: 'in'
    }
  }));
}

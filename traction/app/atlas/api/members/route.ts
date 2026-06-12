import { NextRequest } from 'next/server';
import { getUsersCollection } from '@/lib/db-atlas';
import { getSession } from '@/lib/atlas-auth';
import { calculateDistance } from '@/lib/atlas-utils';
import { membersCache } from '@/lib/atlas-cache';

function guessCategory(profession: string, company: string): string {
  const text = (profession + ' ' + company).toLowerCase();
  if (text.includes('tech') || text.includes('software') || text.includes('developer') || text.includes('it ')) return 'it_services';
  if (text.includes('real estate') || text.includes('realtor') || text.includes('property')) return 'real_estate';
  if (text.includes('legal') || text.includes('law') || text.includes('attorney')) return 'legal';
  if (text.includes('finance') || text.includes('bank') || text.includes('account')) return 'finance';
  if (text.includes('health') || text.includes('doctor') || text.includes('clinic')) return 'healthcare';
  if (text.includes('market') || text.includes('pr ') || text.includes('agency')) return 'marketing';
  if (text.includes('consult')) return 'consulting';
  if (text.includes('construct') || text.includes('build')) return 'construction';
  if (text.includes('food') || text.includes('restaurant') || text.includes('cafe')) return 'restaurant';
  if (text.includes('design') || text.includes('art')) return 'art_design';
  if (text.includes('educat') || text.includes('teach') || text.includes('tutor')) return 'education';
  
  const fallbackCategories = ['consulting', 'other', 'marketing', 'retail'];
  return fallbackCategories[text.length % fallbackCategories.length];
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const hasLocation = searchParams.has('lat') && searchParams.has('lng');
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const radius = parseFloat(searchParams.get('radius') || '50');
    const categoryFilter = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 50;
    const skip = (page - 1) * limit;

    // Cache key based on rounded coordinates (approx ~1km grid) to maximize cache hits
    const cacheKey = `members_${Math.round(lat * 100) / 100}_${Math.round(lng * 100) / 100}_${radius}_${categoryFilter || 'all'}_${page}`;
    
    const cachedMembers = membersCache.get(cacheKey);
    if (cachedMembers) {
      return Response.json({ members: cachedMembers });
    }

    const users = await getUsersCollection();
    let query: any = {};
    if (categoryFilter) {
      query.category = categoryFilter;
    }
    
    // Make sure we only get users with valid profession
    query.profession = { $exists: true, $ne: '' };

    let dbUsers;

    if (hasLocation) {
      // Use geospatial index for ultra-fast querying instead of loading 500 docs into memory
      query.location = {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: radius * 1000 // meters
        }
      };
      
      dbUsers = await users.find(query, { projection: { password: 0 } })
        .skip(skip)
        .limit(limit)
        .toArray();
      
      // Calculate exact distance for the UI
      dbUsers.forEach(u => {
        if (u.location && u.location.coordinates) {
          u.calculatedDistance = calculateDistance(lat, lng, u.location.coordinates[1], u.location.coordinates[0]);
        } else if (u.latitude != null && u.longitude != null) {
          u.calculatedDistance = calculateDistance(lat, lng, Number(u.latitude), Number(u.longitude));
        } else {
          u.calculatedDistance = Infinity;
        }
      });
    } else {
      dbUsers = await users.find(query, { projection: { password: 0 } })
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .toArray();
    }

    const members = dbUsers.map((u) => {
        const category = u.category || guessCategory(u.profession || '', u.company || '');
        const outLat = u.location?.coordinates?.[1] ?? Number(u.latitude);
        const outLng = u.location?.coordinates?.[0] ?? Number(u.longitude);

        return {
          id: u._id.toString(), name: u.name || '', email: u.email || '',
          profession: u.profession || '', company: u.company || '', bio: u.bio || '',
          avatar: u.avatar || '', city: u.city || '',
          category: category,
          customCategory: u.customCategory || '',
          latitude: outLat,
          longitude: outLng,
          address: u.address || '',
          currentLatitude: u.currentLatitude != null ? Number(u.currentLatitude) : null,
          currentLongitude: u.currentLongitude != null ? Number(u.currentLongitude) : null,
          currentCity: u.currentCity || '',
          phone: u.phone || '',
          googleMapsLink: u.googleMapsLink || '',
          distance: u.calculatedDistance ?? 0,
        };
      });

    membersCache.set(cacheKey, members);
    
    return Response.json({ members });
  } catch (error) {
    console.error('Get members error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

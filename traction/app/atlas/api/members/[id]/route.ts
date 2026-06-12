import { NextRequest } from 'next/server';
import { ObjectId } from 'mongodb';
import { getUsersCollection } from '@/lib/db-atlas';
import { getSession } from '@/lib/atlas-auth';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    let objectId: ObjectId;
    try { objectId = new ObjectId(id); } catch {
      return Response.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const users = await getUsersCollection();
    const user = await users.findOne({ _id: objectId }, { projection: { password: 0 } });
    if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

    return Response.json({
      user: {
        id: user._id.toString(), name: user.name || '', email: user.email || '',
        profession: user.profession || '', company: user.company || '', bio: user.bio || '',
        avatar: user.avatar || '', city: user.city || '',
        availability: user.availability || 'Available',
        latitude: user.latitude != null && !isNaN(Number(user.latitude)) ? Number(user.latitude) : null,
        longitude: user.longitude != null && !isNaN(Number(user.longitude)) ? Number(user.longitude) : null,
        address: user.address || '',
        currentLatitude: user.currentLatitude != null && !isNaN(Number(user.currentLatitude)) ? Number(user.currentLatitude) : null,
        currentLongitude: user.currentLongitude != null && !isNaN(Number(user.currentLongitude)) ? Number(user.currentLongitude) : null,
        currentCity: user.currentCity || '',
      },
    });
  } catch (error) {
    console.error('Get member error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

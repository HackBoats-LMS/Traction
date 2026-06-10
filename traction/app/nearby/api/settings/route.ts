import { NextRequest } from 'next/server';
import { ObjectId } from 'mongodb';
import { getUsersCollection } from '@/lib/db-nearby';
import { getSession } from '@/lib/nearby-auth';

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { name, profession, company, bio, latitude, longitude, city, address, category, customCategory, phone, googleMapsLink } = body;

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (name !== undefined) updateData.name = name;
    if (profession !== undefined) updateData.profession = profession;
    if (company !== undefined) updateData.company = company;
    if (bio !== undefined) updateData.bio = bio;

    if (latitude !== undefined) updateData.latitude = latitude !== null ? Number(latitude) : null;
    if (longitude !== undefined) updateData.longitude = longitude !== null ? Number(longitude) : null;
    
    if (updateData.latitude != null && updateData.longitude != null) {
      updateData.location = {
        type: "Point",
        coordinates: [updateData.longitude, updateData.latitude]
      };
    } else if (updateData.latitude === null && updateData.longitude === null) {
      updateData.location = null;
    }
    if (city !== undefined) updateData.city = city;
    if (address !== undefined) updateData.address = address;
    if (category !== undefined) updateData.category = category;
    if (customCategory !== undefined) updateData.customCategory = customCategory;
    if (phone !== undefined) updateData.phone = phone;
    if (googleMapsLink !== undefined) updateData.googleMapsLink = googleMapsLink;

    const users = await getUsersCollection();
    await users.updateOne({ _id: new ObjectId(session.userId) }, { $set: updateData });

    const user = await users.findOne(
      { _id: new ObjectId(session.userId) },
      { projection: { password: 0 } }
    );

    return Response.json({
      success: true,
      user: user ? {
        id: user._id.toString(), name: user.name || '', email: user.email || '',
        profession: user.profession || '', company: user.company || '', bio: user.bio || '',
        avatar: user.avatar || '', city: user.city || '',
        latitude: user.latitude != null ? Number(user.latitude) : null,
        longitude: user.longitude != null ? Number(user.longitude) : null,
        address: user.address || '',
        currentLatitude: user.currentLatitude != null ? Number(user.currentLatitude) : null,
        currentLongitude: user.currentLongitude != null ? Number(user.currentLongitude) : null,
        currentCity: user.currentCity || '',
        category: user.category || '',
        customCategory: user.customCategory || '',
        phone: user.phone || '',
        googleMapsLink: user.googleMapsLink || '',
        isApproved: user.isApproved ?? true,
      } : null,
    });
  } catch (error) {
    console.error('Update settings error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

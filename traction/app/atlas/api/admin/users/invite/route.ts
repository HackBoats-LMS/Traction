import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/atlas-auth';
import { getUsersCollection } from '@/lib/db-atlas';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await getUsersCollection();
    if (session.userId !== 'admin_user_id') {
      const adminUser = await users.findOne({ _id: new ObjectId(session.userId) });
      if (!adminUser || adminUser.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const body = await request.json();
    const { email, name, profession, company } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }


    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    const newUser = {
      name: name || '',
      email: email.toLowerCase(),
      password: '',
      profession: profession || '',
      company: company || '',
      bio: '',
      avatar: '',
      city: '',
      availability: 'Available',
      latitude: null,
      longitude: null,
      address: '',
      currentLatitude: null,
      currentLongitude: null,
      currentCity: '',
      lastLocationUpdate: null,
      authProvider: 'google',
      role: 'user',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await users.insertOne(newUser);

    return NextResponse.json({ success: true, user: { id: result.insertedId.toString(), ...newUser } });
  } catch (error) {
    console.error('Failed to invite user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getSettingsCollection, getUsersCollection } from '@/lib/db-atlas';
import { getSession } from '@/lib/atlas-auth';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let isAdmin = session.userId === 'admin_user_id';
    
    if (!isAdmin) {
      const users = await getUsersCollection();
      const user = await users.findOne({ _id: new ObjectId(session.userId) });
      if (user?.role === 'admin') isAdmin = true;
    }

    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const settings = await getSettingsCollection();
    const globalSettings = await settings.findOne({ _id: 'global' as unknown as ObjectId });
    
    return NextResponse.json({ isAccessOpen: globalSettings?.isAccessOpen ?? false });
  } catch (err) {
    console.error('Failed to get settings:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let isAdmin = session.userId === 'admin_user_id';
    
    if (!isAdmin) {
      const users = await getUsersCollection();
      const user = await users.findOne({ _id: new ObjectId(session.userId) });
      if (user?.role === 'admin') isAdmin = true;
    }

    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    if (typeof body.isAccessOpen !== 'boolean') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const settings = await getSettingsCollection();
    await settings.updateOne(
      { _id: 'global' as unknown as ObjectId },
      { $set: { isAccessOpen: body.isAccessOpen } },
      { upsert: true }
    );
    
    return NextResponse.json({ success: true, isAccessOpen: body.isAccessOpen });
  } catch (err) {
    console.error('Failed to update settings:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

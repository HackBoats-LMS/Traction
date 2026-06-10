import { NextRequest } from 'next/server';
import { ObjectId } from 'mongodb';
import { getUsersCollection } from '@/lib/db-nearby';
import { getSession } from '@/lib/nearby-auth';

// Helper to check admin auth
async function requireAdmin() {
  const session = await getSession();
  if (!session) return null;
  
  if (session.userId === 'admin_user_id') return session;

  const users = await getUsersCollection();
  const user = await users.findOne({ _id: new ObjectId(session.userId) });
  if (!user || user.role !== 'admin') return null;

  return session;
}

export async function GET(request: NextRequest) {
  try {
    const adminSession = await requireAdmin();
    if (!adminSession) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const users = await getUsersCollection();
    const allUsers = await users.find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    const totalCount = await users.countDocuments();

    const formattedUsers = allUsers.map(u => ({
      id: u._id.toString(),
      name: u.name || '',
      email: u.email || '',
      profession: u.profession || '',
      avatar: u.avatar || '',
      role: u.role || 'user',
      isApproved: u.isApproved || false,
      createdAt: u.createdAt || new Date(),
    }));

    return Response.json({ users: formattedUsers });
  } catch (error) {
    console.error('Admin fetch users error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const adminSession = await requireAdmin();
    if (!adminSession) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { userId, isApproved, role } = body;

    if (!userId) {
      return Response.json({ error: 'Missing userId' }, { status: 400 });
    }

    const users = await getUsersCollection();
    
    // Check if the target user is the built-in admin to prevent accidents
    if (userId === 'admin_user_id') {
      return Response.json({ error: 'Cannot modify built-in admin' }, { status: 403 });
    }

    const updateFields: any = { updatedAt: new Date() };
    if (isApproved !== undefined) updateFields.isApproved = Boolean(isApproved);
    if (role !== undefined) updateFields.role = role;

    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Admin update user error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const adminSession = await requireAdmin();
    if (!adminSession) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return Response.json({ error: 'Missing userId' }, { status: 400 });
    }

    const users = await getUsersCollection();
    
    if (userId === 'admin_user_id') {
      return Response.json({ error: 'Cannot delete built-in admin' }, { status: 403 });
    }

    const result = await users.deleteOne({ _id: new ObjectId(userId) });

    if (result.deletedCount === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Admin delete user error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

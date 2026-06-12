import { NextRequest } from 'next/server';
import { getSession } from '@/lib/atlas-auth';
import { getNotificationsCollection } from '@/lib/db-atlas';
import type { Notification } from '@/lib/atlas-types';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const notificationsCollection = await getNotificationsCollection();
    
    // Fetch real notifications for the logged in user
    const dbNotifications = await notificationsCollection
      .find({ userId: session.userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();

    // Map _id to id
    const notifications = dbNotifications.map(n => ({
      id: n._id.toString(),
      type: n.type,
      title: n.title,
      message: n.message,
      isRead: n.isRead,
      createdAt: n.createdAt,
      actionUrl: n.actionUrl
    }));
    
    return Response.json({ success: true, notifications });
  } catch (error) {
    console.error('Notifications error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

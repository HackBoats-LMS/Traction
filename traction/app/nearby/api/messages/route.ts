import { NextRequest } from 'next/server';
import { getDb } from '@/lib/db-nearby';
import { getSession } from '@/lib/nearby-auth';
import { ObjectId } from 'mongodb';

// GET /api/messages?otherId=XYZ
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const otherId = searchParams.get('otherId');
    if (!otherId) return Response.json({ error: 'Missing otherId' }, { status: 400 });

    const db = await getDb();
    const messagesCollection = db.collection('messages');

    // Fetch messages between currentUser and otherId
    const messages = await messagesCollection
      .find({
        $or: [
          { senderId: session.userId, receiverId: otherId },
          { senderId: otherId, receiverId: session.userId },
        ],
      })
      .sort({ createdAt: 1 })
      .toArray();

    const formattedMessages = messages.map((m) => ({
      id: m._id.toString(),
      sender: m.senderId === session.userId ? 'me' : 'them',
      text: m.text,
      time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));

    return Response.json({ messages: formattedMessages });
  } catch (error) {
    console.error('Fetch messages error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/messages
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { receiverId, text } = body;
    if (!receiverId || !text) {
      return Response.json({ error: 'Missing receiverId or text' }, { status: 400 });
    }

    const db = await getDb();
    const messagesCollection = db.collection('messages');

    const newMessage = {
      senderId: session.userId,
      receiverId,
      text,
      createdAt: new Date(),
    };

    await messagesCollection.insertOne(newMessage);

    return Response.json({ success: true });
  } catch (error) {
    console.error('Send message error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

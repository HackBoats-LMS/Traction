import { NextRequest } from 'next/server';
import { getUsersCollection } from '@/lib/db-atlas';
import { getSession } from '@/lib/atlas-auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return Response.json({ results: [] });
    }

    const users = await getUsersCollection();
    
    // Use text index search for optimal performance
    const results = await users.find({
      $text: { $search: query }
    })
    .project({ 
      password: 0 // Never return passwords
    })
    .limit(10)
    .toArray();

    // Map _id to id to match UserProfile interface
    const formattedResults = results.map(user => ({
      ...user,
      id: user._id.toString(),
      _id: undefined
    }));

    return Response.json({ success: true, results: formattedResults });
  } catch (error) {
    console.error('Search error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

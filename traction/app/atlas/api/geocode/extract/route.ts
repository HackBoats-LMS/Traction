import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    let expandedUrl = url;

    // Follow redirects for shortened URLs like maps.app.goo.gl or goo.gl/maps
    if (url.includes('goo.gl') || url.includes('maps.app.goo.gl')) {
      try {
        const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
        expandedUrl = response.url;
      } catch (err) {
        // Fallback to GET if HEAD fails
        try {
          const response = await fetch(url, { method: 'GET', redirect: 'follow' });
          expandedUrl = response.url;
        } catch (e) {
          console.warn('Failed to expand URL:', e);
        }
      }
    }

    // Try to extract coordinates from the expanded URL
    // Format 1: !3d17.5022875!4d78.3247455 (Exact Pin)
    // Format 2: @19.0660601,72.8631169 (Viewport center)
    // Format 3: query=19.0660601,72.8631169 or q=19.0660601,72.8631169
    // Format 4: ll=19.0660601,72.8631169
    // Format 5: dir//19.0660601,72.8631169

    // Try finding exact pin first (!3d followed by !4d)
    const exactPinRegex = /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/i;
    const exactMatch = expandedUrl.match(exactPinRegex);

    const latLngRegex = /@(-?\d+\.\d+),(-?\d+\.\d+)|(?:q|query|ll)=(-?\d+\.\d+),(-?\d+\.\d+)|dir\/\/?(?:.*?)\/(-?\d+\.\d+),(-?\d+\.\d+)/i;
    const match = expandedUrl.match(latLngRegex);

    let lat, lng;

    if (exactMatch && exactMatch[1] && exactMatch[2]) {
      lat = exactMatch[1];
      lng = exactMatch[2];
    } else if (match) {
      if (match[1] && match[2]) {
        lat = match[1]; lng = match[2];
      } else if (match[3] && match[4]) {
        lat = match[3]; lng = match[4];
      } else if (match[5] && match[6]) {
        lat = match[5]; lng = match[6];
      }
    }

    if (lat && lng) {
      return NextResponse.json({
        success: true,
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        expandedUrl
      }, {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
        }
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Could not extract coordinates from the link',
      expandedUrl
    }, { status: 404 });

  } catch (error) {
    console.error('Extract coordinates error:', error);
    return NextResponse.json({ error: 'Failed to process URL' }, { status: 500 });
  }
}

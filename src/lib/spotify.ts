
// @ts-nocheck
import { Song } from './types';

const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const client_secret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const API_BASE = 'https://api.spotify.com/v1';

let accessToken = {
    token: null,
    expiresAt: 0,
};

// --- HELPER FUNCTIONS ---
const getAccessToken = async () => {
    if (!client_id || !client_secret) {
        throw new Error('Spotify API client ID or secret is not configured in .env file.');
    }

    if (accessToken.token && Date.now() < accessToken.expiresAt) {
        return accessToken.token;
    }

    const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
        throw new Error(`Failed to get Spotify access token: ${response.statusText}`);
    }

    const data = await response.json();
    accessToken = {
        token: data.access_token,
        // Set expiry to 5 minutes before it actually expires to be safe
        expiresAt: Date.now() + (data.expires_in - 300) * 1000,
    };
    return accessToken.token;
};


const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;
};

const keyMap = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const modeMap = ['minor', 'Major'];
const formatKey = (key, mode) => `${keyMap[key]} ${modeMap[mode]}`;

const transformTrackData = (track, features): Song => {
    return {
        id: track.id,
        title: track.name,
        artist: track.artists.map((a) => a.name).join(', '),
        bpm: features ? Math.round(features.tempo).toString() : 'N/A',
        key: (features && features.key !== -1) ? formatKey(features.key, features.mode) : 'N/A',
        duration: formatDuration(track.duration_ms),
        imageUrl: track.album.images?.[0]?.url || 'https://placehold.co/100x100.png',
    };
};


// --- EXPORTED API FUNCTIONS ---

export const searchTracks = async (query: string): Promise<Song[]> => {
    const token = await getAccessToken();
    const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&type=track&limit=9`, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch from Spotify API');
    }

    const data = await response.json();
    if (!data.tracks || data.tracks.items.length === 0) {
        return [];
    }

    const trackIds = data.tracks.items.map(t => t.id).join(',');
    const featuresResponse = await fetch(`${API_BASE}/audio-features?ids=${trackIds}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
     if (!featuresResponse.ok) {
        // We can still proceed without features, just log the error.
        console.error("Could not fetch audio features for search results");
        const featuresMap = new Map();
        return data.tracks.items.map(track => {
            const features = featuresMap.get(track.id);
            return transformTrackData(track, features);
        });
    }

    const featuresData = await featuresResponse.json();
    const featuresMap = new Map(featuresData.audio_features.filter(f => f).map(f => [f.id, f]));

    return data.tracks.items.map(track => {
        const features = featuresMap.get(track.id);
        return transformTrackData(track, features);
    });
};

export const getTrackDetails = async (trackId: string): Promise<Song> => {
    const token = await getAccessToken();
    
    const trackResponse = await fetch(`${API_BASE}/tracks/${trackId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
     if (!trackResponse.ok) {
        throw new Error('Failed to get track details from Spotify');
    }

    const featuresResponse = await fetch(`${API_BASE}/audio-features/${trackId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!featuresResponse.ok) {
        throw new Error('Failed to get audio features from Spotify');
    }

    const trackData = await trackResponse.json();
    const featuresData = await featuresResponse.json();

    return transformTrackData(trackData, featuresData);
}

// Deprecated function, kept for compatibility if anything still uses it.
export const getSpotifyTrack = async (query: string) => {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&type=track&limit=1`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (data.tracks && data.tracks.items.length > 0) {
    return data.tracks.items[0];
  }
  return null;
};

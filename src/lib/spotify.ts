// @ts-nocheck
import { Song } from './types';

const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const client_secret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

// Corrected Spotify API Endpoints
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const API_BASE = 'https://api.spotify.com/v1';

let accessToken = {
    token: null,
    expiresAt: 0,
};

// --- HELPER FUNCTIONS ---

/**
 * Retrieves a valid Spotify access token.
 * It reuses an existing token if it hasn't expired, otherwise, it fetches a new one.
 * Throws an error if client ID/secret are not configured or token acquisition fails.
 */
const getAccessToken = async (): Promise<string> => {
    if (!client_id || !client_secret) {
        throw new Error('Spotify API client ID or secret is not configured in .env file.');
    }

    // Check if the current token is still valid
    if (accessToken.token && Date.now() < accessToken.expiresAt) {
        return accessToken.token;
    }

    try {
        const response = await fetch(TOKEN_ENDPOINT, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${basic}`,
                'Content-Type': 'application/x-us-www-form-urlencoded',
            },
            body: 'grant_type=client_credentials',
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to get Spotify access token: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        accessToken = {
            token: data.access_token,
            // Set expiry to 5 minutes before it actually expires to be safe
            expiresAt: Date.now() + (data.expires_in - 300) * 1000,
        };
        return accessToken.token;
    } catch (error) {
        console.error('Error fetching Spotify access token:', error);
        throw error; // Re-throw to be handled by the caller
    }
};

/**
 * Formats a duration in milliseconds into a "minutes:seconds" string.
 */
const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

// Maps for converting Spotify's key and mode integers to human-readable format
const keyMap = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const modeMap = ['minor', 'Major'];

/**
 * Formats the key and mode into a string (e.g., "C Major", "F# minor").
 */
const formatKey = (key: number, mode: number): string => {
    // Spotify's key ranges from 0-11, and mode is 0 (minor) or 1 (major)
    if (key >= 0 && key < keyMap.length && (mode === 0 || mode === 1)) {
        return `${keyMap[key]} ${modeMap[mode]}`;
    }
    return 'N/A'; // Return N/A if key or mode are out of expected range
};

/**
 * Transforms raw Spotify track and audio features data into the Song type.
 */
const transformTrackData = (track: any, features: any): Song => {
    return {
        id: track.id,
        title: track.name,
        artist: track.artists.map((a: { name: string }) => a.name).join(', '),
        // Ensure BPM is rounded and converted to string, default to 'N/A' if not available
        bpm: features?.tempo ? Math.round(features.tempo).toString() : 'N/A',
        // Ensure key and mode are valid before formatting, default to 'N/A'
        key: (features?.key !== undefined && features?.mode !== undefined) ? formatKey(features.key, features.mode) : 'N/A',
        duration: formatDuration(track.duration_ms),
        imageUrl: track.album.images?.[0]?.url || 'https://placehold.co/100x100.png',
    };
};

// --- EXPORTED API FUNCTIONS ---

/**
 * Searches for tracks on Spotify based on a query string.
 * It fetches track details and then their corresponding audio features (BPM, Key).
 */
export const searchTracks = async (query: string): Promise<Song[]> => {
    const token = await getAccessToken();
    const searchUrl = `${API_BASE}/search?q=${encodeURIComponent(query)}&type=track&limit=9`;

    try {
        const response = await fetch(searchUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch tracks from Spotify: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        if (!data.tracks || data.tracks.items.length === 0) {
            return [];
        }

        const trackIds = data.tracks.items.map((t: { id: string }) => t.id).join(',');
        const featuresResponse = await fetch(`${API_BASE}/audio-features?ids=${trackIds}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!featuresResponse.ok) {
            console.error('Failed to get audio features for search results. Returning tracks without BPM/Key.');
            return data.tracks.items.map((track: any) => transformTrackData(track, null));
        }

        const featuresData = await featuresResponse.json();
        // Create a map for quick lookup of features by track ID
        const featuresMap = new Map(featuresData.audio_features.filter((f: any) => f).map((f: any) => [f.id, f]));

        return data.tracks.items.map((track: any) => {
            const features = featuresMap.get(track.id);
            return transformTrackData(track, features);
        });
    } catch (error) {
        console.error('Error in searchTracks:', error);
        throw error;
    }
};

/**
 * Retrieves detailed information for a single Spotify track, including its audio features.
 */
export const getTrackDetails = async (trackId: string): Promise<Song> => {
    const token = await getAccessToken();

    try {
        const trackResponse = await fetch(`${API_BASE}/tracks/${trackId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!trackResponse.ok) {
            const errorText = await trackResponse.text();
            throw new Error(`Failed to get track details for ID ${trackId}: ${trackResponse.status} - ${errorText}`);
        }

        const trackData = await trackResponse.json();

        const featuresResponse = await fetch(`${API_BASE}/audio-features/${trackId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!featuresResponse.ok) {
            console.error(`Failed to get audio features for track ${trackId}. Returning details without them.`);
            return transformTrackData(trackData, null);
        }

        const featuresData = await featuresResponse.json();
        return transformTrackData(trackData, featuresData);
    } catch (error) {
        console.error('Error in getTrackDetails:', error);
        throw error;
    }
};

/**
 * Deprecated function. Use searchTracks for better results and audio feature retrieval.
 * Kept for compatibility if anything still uses it.
 */
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

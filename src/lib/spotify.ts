
'use server';

import type { Song } from './types';

const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const client_secret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

let accessToken: {
  token: string | null;
  expiresAt: number;
} = {
  token: null,
  expiresAt: 0,
};

/**
 * Retrieves a valid Spotify access token, fetching a new one if necessary.
 * @returns {Promise<string>} A promise that resolves to the access token.
 */
const getAccessToken = async (): Promise<string> => {
  if (accessToken.token && Date.now() < accessToken.expiresAt) {
    return accessToken.token;
  }

  if (!client_id || !client_secret) {
    throw new Error('Spotify API client ID or secret is not configured.');
  }

  const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get Spotify access token: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  accessToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 300) * 1000,
  };
  return accessToken.token!;
};

/**
 * Formats a duration in milliseconds into a "minutes:seconds" string.
 * @param {number} ms - The duration in milliseconds.
 * @returns {string} The formatted duration string.
 */
const formatDuration = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const keyMap = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const modeMap = ['Minor', 'Major'];

/**
 * Formats the key and mode into a string (e.g., "C Major").
 * @param {number} key - The key index (0-11).
 * @param {number} mode - The mode (0 for minor, 1 for major).
 * @returns {string} The formatted key string.
 */
const formatKey = (key: number, mode: number): string => {
  if (key >= 0 && key < keyMap.length && (mode === 0 || mode === 1)) {
    return `${keyMap[key]} ${modeMap[mode]}`;
  }
  return 'N/A';
};

/**
 * Transforms raw Spotify track and audio features data into the Song type.
 * @param {any} track - The raw track object from Spotify.
 * @param {any | null} features - The raw audio features object.
 * @returns {Song} The transformed Song object.
 */
const transformTrackData = (track: any, features: any | null): Song => {
  return {
    id: track.id,
    title: track.name,
    artist: track.artists.map((a: { name: string }) => a.name).join(', '),
    bpm: features?.tempo ? String(Math.round(features.tempo)) : 'N/A',
    key: (features?.key !== undefined && features?.mode !== undefined) ? formatKey(features.key, features.mode) : 'N/A',
    duration: formatDuration(track.duration_ms),
    imageUrl: track.album.images?.[0]?.url || 'https://placehold.co/100x100.png',
  };
};

/**
 * Searches for tracks on Spotify and gets their audio features.
 * @param {string} query - The search query.
 * @returns {Promise<Song[]>} A promise that resolves to an array of Song objects.
 */
export const searchTracks = async (query: string): Promise<Song[]> => {
  const token = await getAccessToken();
  
  let searchUrl;
  if (query === 'popular') {
    searchUrl = `https://api.spotify.com/v1/search?q=popular&type=track&limit=9`;
  } else {
    searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=9`;
  }


  const searchResponse = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!searchResponse.ok) throw new Error('Failed to search tracks');
  const searchData = await searchResponse.json();
  const tracks = searchData.tracks?.items;

  if (!tracks || tracks.length === 0) return [];

  const trackIds = tracks.map((t: { id: string }) => t.id).join(',');
  const featuresResponse = await fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIds}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!featuresResponse.ok) {
    // If features fail, we can still return track data without bpm/key
    console.error('Failed to get audio features');
    return tracks.map((track: any) => transformTrackData(track, null));
  }
  
  const featuresData = await featuresResponse.json();
  const featuresMap = new Map(featuresData.audio_features.filter(Boolean).map((f: any) => [f.id, f]));

  return tracks.map((track: any) => {
    const features = featuresMap.get(track.id);
    return transformTrackData(track, features);
  }).filter((song: Song | null): song is Song => song !== null);
};

/**
 * Retrieves detailed information for a single Spotify track and its audio features.
 * @param {string} trackId - The Spotify ID of the track.
 * @returns {Promise<Song>} A promise that resolves to a single Song object.
 */
export const getTrackDetails = async (trackId: string): Promise<Song> => {
  const token = await getAccessToken();
  const trackUrl = `https://api.spotify.com/v1/tracks/${trackId}`;
  const featuresUrl = `https://api.spotify.com/v1/audio-features/${trackId}`;

  const [trackResponse, featuresResponse] = await Promise.all([
    fetch(trackUrl, { headers: { Authorization: `Bearer ${token}` } }),
    fetch(featuresUrl, { headers: { Authorization: `Bearer ${token}` } }),
  ]);

  if (!trackResponse.ok) {
    const errorText = await trackResponse.text();
    throw new Error(`Failed to get track details: ${trackResponse.status} ${errorText}`);
  }
  
  const trackData = await trackResponse.json();
  
  // Features can sometimes be null for certain tracks, so we handle that gracefully
  if (!featuresResponse.ok) {
    console.warn(`Could not get audio features for track ${trackId}`);
    return transformTrackData(trackData, null);
  }

  const featuresData = await featuresResponse.json();

  return transformTrackData(trackData, featuresData);
};

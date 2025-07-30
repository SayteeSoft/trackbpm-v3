
'use server';

import type { Song } from './types';
import { getSongDetails } from '@/ai/flows/get-song-details';

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
    cache: 'force-cache',
    next: {
      revalidate: 3500,
    }
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

/**
 * Transforms raw Spotify track data and AI features into the Song type.
 * @param {any} track - The raw track object from Spotify.
 * @param {{key: string, bpm: string, duration: string} | null} features - The AI-generated features.
 * @returns {Song} The transformed Song object.
 */
const transformTrackData = (track: any, features: {key: string, bpm: string, duration: string} | null): Song => {
  return {
    id: track.id,
    title: track.name,
    artist: track.artists.map((a: { name: string }) => a.name).join(', '),
    bpm: features?.bpm || '',
    key: features?.key || '',
    duration: features?.duration || formatDuration(track.duration_ms),
    imageUrl: track.album.images?.[0]?.url || 'https://placehold.co/100x100.png',
  };
};

/**
 * Searches for tracks on Spotify and gets their audio features from AI.
 * @param {string} query - The search query.
 * @returns {Promise<Song[]>} A promise that resolves to an array of Song objects.
 */
export const searchTracks = async (query: string): Promise<Song[]> => {
  const token = await getAccessToken();
  
  const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=9`;

  const searchResponse = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!searchResponse.ok) throw new Error('Failed to search tracks');
  const searchData = await searchResponse.json();
  const tracks = searchData.tracks?.items;

  if (!tracks || tracks.length === 0) return [];

  // Get AI features for all tracks in parallel
  const featuresPromises = tracks.map((track: any) => 
    getSongDetails({
      title: track.name,
      artist: track.artists.map((a: { name: string }) => a.name).join(', '),
    }).catch(e => {
        console.error(`Failed to get AI details for ${track.name}`, e);
        return null; // Return null if AI call fails
    })
  );
  
  const featuresResults = await Promise.all(featuresPromises);

  return tracks.map((track: any, index: number) => {
    const features = featuresResults[index];
    return transformTrackData(track, features);
  }).filter((song: Song | null): song is Song => song !== null);
};

/**
 * Retrieves detailed information for a single Spotify track and its AI audio features.
 * @param {string} trackId - The Spotify ID of the track.
 * @returns {Promise<Song>} A promise that resolves to a single Song object.
 */
export const getTrackDetails = async (trackId: string): Promise<Song> => {
  const token = await getAccessToken();
  const trackUrl = `https://api.spotify.com/v1/tracks/${trackId}`;
  
  const trackPromise = fetch(trackUrl, { headers: { Authorization: `Bearer ${token}` } });
  
  // Eagerly get the track data to start the AI call
  const trackResponseForAi = await fetch(trackUrl, { headers: { Authorization: `Bearer ${token}` } });
  if (!trackResponseForAi.ok) {
     const errorText = await trackResponseForAi.text();
     throw new Error(`Failed to get track details for AI: ${trackResponseForAi.status} ${errorText}`);
  }
  const trackDataForAi = await trackResponseForAi.json();

  const featuresPromise = getSongDetails({
      title: trackDataForAi.name,
      artist: trackDataForAi.artists.map((a: { name: string }) => a.name).join(', '),
  }).catch(e => {
      console.warn(`Could not get AI audio features for track ${trackId}`, e);
      return null;
  });


  const [trackResponse, features] = await Promise.all([trackPromise, featuresPromise]);
  
  if (!trackResponse.ok) {
    const errorText = await trackResponse.text();
    throw new Error(`Failed to get track details: ${trackResponse.status} ${errorText}`);
  }
  
  const trackData = await trackResponse.json();

  return transformTrackData(trackData, features);
};

export const getDailySongs = async (): Promise<Song[]> => {
    const dayOfWeek = new Date().getDay();
    const queries = [
        'top global',
        'new releases',
        'viral hits',
        'pop rising',
        'today\'s top hits',
        'rock classics',
        'hip hop favorites'
    ];
    const query = queries[dayOfWeek];
    return searchTracks(query);
}


'use server';
import { z } from 'zod';
import { searchTracks, getTrackDetails } from '@/lib/spotify';
import { Song } from './types';

export async function searchSpotifyTracks(query: string): Promise<{songs?: Song[], error?: string}> {
  const schema = z.string().min(1, { message: 'Search query must be at least 1 character long.' });
  const validation = schema.safeParse(query);
  if (!validation.success) {
    return { error: validation.error.flatten().formErrors[0] };
  }

  try {
    const results = await searchTracks(query);
    return { songs: results };
  } catch (e: any) {
    console.error(e);
    return { error: e.message || 'Failed to search for songs. Please try again later.' };
  }
}

export async function getSpotifyTrackDetails(trackId: string): Promise<{song?: Song, error?: string}> {
    const schema = z.string().min(1, { message: 'A valid track ID must be provided.' });
    const validation = schema.safeParse(trackId);
    if (!validation.success) {
      return { error: validation.error.flatten().formErrors[0] };
    }
  
    try {
      const result = await getTrackDetails(trackId);
      return { song: result };
    } catch (e: any) {
      console.error(e);
      return { error: e.message || 'Failed to get song details. Please try again later.' };
    }
  }

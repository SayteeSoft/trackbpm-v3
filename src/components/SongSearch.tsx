
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import SongCard from '@/components/SongCard';
import AdBanner from '@/components/AdBanner';
import { Song } from '@/lib/types';
import { Search, Loader2 } from 'lucide-react';
import { searchSpotifyTracks } from '@/lib/actions';

function ExampleSong() {
  return (
     <div className="text-center text-sm text-muted-foreground mt-4 px-4">
        <p>
            For example: <span className="font-semibold text-foreground">david bowie - space oddity</span> (which is 81 BPM, by the way)
        </p>
    </div>
  );
}

function SearchResults({ songs, isLoading, searchTerm }: { songs: Song[], isLoading: boolean, searchTerm: string }) {
  if (isLoading) {
     return (
       <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
       </div>
    );
  }

  if (songs.length === 0 && searchTerm) {
    return (
        <div className="text-center text-sm text-muted-foreground py-12">
          <p>No results found for "{searchTerm}".</p>
        </div>
    );
  }
  
  if (songs.length === 0) {
    return null;
  }
  
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className="space-y-4 max-w-[calc(42rem+90px)] mx-auto mb-8">
        {songs.map((song, index) => (
          <React.Fragment key={song.id}>
            <SongCard song={song} />
            {(index + 1) === 3 && <AdBanner />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}


export default function SongSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Start loading by default
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (term: string) => {
    if (!term) {
        setSongs([]);
        setIsLoading(false);
        return;
    }
    
    setIsLoading(true);
    setError(null);

    const result = await searchSpotifyTracks(term);
    if (result.error) {
      setError(result.error);
      setSongs([]);
    } else {
      setSongs(result.songs || []);
    }
    setIsLoading(false);
  }, []);
  
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      // Only set the debounced term if the user has typed something.
      // The initial search is handled by the other useEffect.
      if (searchTerm) {
        setDebouncedSearchTerm(searchTerm);
      }
    }, 500);
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);


  useEffect(() => {
    // This effect runs only when debouncedSearchTerm changes
    if (debouncedSearchTerm) {
      handleSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, handleSearch]);

  useEffect(() => {
    // This effect runs only once on mount to get the initial songs
    handleSearch('popular');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs only once

  return (
    <>
      <div className="w-full max-w-[calc(42rem+120px)] mx-auto mb-2 relative -mt-[29px] px-4">
        <Input
          type="text"
          placeholder="type a song, get a bpm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-4 pr-12 py-6 text-base md:py-7 md:text-lg rounded-md shadow-lg bg-card border-2 border-border"
        />
        {isLoading ? (
          <Loader2 className="absolute right-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground animate-spin" />
        ) : (
          <Search className="absolute right-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
        )}
      </div>
      <ExampleSong />
      <SearchResults songs={songs} isLoading={isLoading} searchTerm={debouncedSearchTerm || (songs.length === 0 && !isLoading ? searchTerm : "")} />
    </>
  );
}

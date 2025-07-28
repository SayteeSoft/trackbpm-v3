
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import SongCard from '@/components/SongCard';
import { Song } from '@/lib/types';
import { Search, Loader2 } from 'lucide-react';
import { searchSpotifyTracks, getDailySongs } from '@/lib/actions';
import Link from 'next/link';
import Image from 'next/image';
import AdBanner from './AdBanner';

function ExampleSong() {
  return (
     <div className="text-center text-sm text-muted-foreground mt-4 px-4">
        <p>
            For example: <span className="font-semibold text-foreground">david bowie - space oddity</span> (which is 81 BPM, by the way)
        </p>
    </div>
  );
}

function SearchResults({ songs, isLoading }: { songs: Song[], isLoading: boolean }) {
  if (isLoading) {
     return (
       <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
       </div>
    );
  }
  
  if (songs.length === 0) {
    return (
        <div className="text-center text-muted-foreground py-12">
            <p>No songs found. Try a different search.</p>
        </div>
    );
  }
  
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className="space-y-4 max-w-[calc(42rem+90px)] mx-auto mb-8">
        {songs.map((song, index) => (
          <React.Fragment key={song.id}>
            <SongCard song={song} />
            {(index + 1) % 3 === 0 && (
               <div className="my-8">
                  {index === 2 ? (
                     <Image src="/banners/website-banner-001(728x90).jpg" alt="advertisement" width={728} height={90} className="w-full max-w-[728px] mx-auto rounded-md" />
                  ) : (
                     <AdBanner />
                  )}
               </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}


export default function SongSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (term: string) => {
    if (!term) return;
    
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
    const fetchDailySongs = async () => {
        setIsLoading(true);
        setError(null);
        const result = await getDailySongs();
        if (result.error) {
            setError(result.error);
            setSongs([]);
        } else {
            setSongs(result.songs || []);
        }
        setIsLoading(false);
    }
    fetchDailySongs();
  }, []);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim() === '') {
        // If search is cleared, we could refetch daily songs or clear the list
        // For now, let's just clear it until a new search is made.
        // Or refetch daily to restore default state.
        const fetchDailySongs = async () => {
            setIsLoading(true);
            setError(null);
            const result = await getDailySongs();
            if (result.error) {
                setError(result.error);
                setSongs([]);
            } else {
                setSongs(result.songs || []);
            }
            setIsLoading(false);
        }
        fetchDailySongs();

    } else {
       handleSearch(term);
    }
  }


  return (
    <>
      <div className="w-full max-w-[calc(42rem+120px)] mx-auto mb-2 relative -mt-[29px] px-4">
        <Input
          type="text"
          placeholder="type a song, get a bpm"
          value={searchTerm}
          onChange={onSearchChange}
          className="w-full pl-4 pr-12 py-6 text-base md:py-7 md:text-lg rounded-md shadow-lg bg-card border-2 border-border"
        />
        {isLoading ? (
          <Loader2 className="absolute right-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground animate-spin" />
        ) : (
          <Search className="absolute right-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
        )}
      </div>
      <ExampleSong />
      <SearchResults songs={songs} isLoading={isLoading} />
    </>
  );
}

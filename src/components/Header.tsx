
"use client";

import Link from "next/link";
import React, { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import SongCard from '@/components/SongCard';
import AdBanner from '@/components/AdBanner';
import { Song } from '@/lib/types';
import { Search, Loader2 } from 'lucide-react';
import { searchSpotifyTracks } from '@/lib/actions';

const DEFAULT_SEARCH_TERM = "Taylor Swift";

const exampleSongs = [
  { text: "The Beatles - All You Need Is Love", bpm: 103 },
  { text: "Queen - Bohemian Rhapsody", bpm: 72 },
  { text: "Michael Jackson - Billie Jean", bpm: 117 },
  { text: "Nirvana - Smells Like Teen Spirit", bpm: 117 },
  { text: "Eagles - Hotel California", bpm: 75 },
  { text: "David Bowie - Space Oddity", bpm: 81 },
];

function ExampleSong() {
  const [currentExample, setCurrentExample] = useState(exampleSongs[0]);

  useEffect(() => {
    const getHourlyExample = () => {
      const hour = new Date().getHours();
      const index = hour % exampleSongs.length;
      setCurrentExample(exampleSongs[index]);
    };
    getHourlyExample();
    const intervalId = setInterval(getHourlyExample, 60 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
     <div className="text-center text-sm text-muted-foreground mt-4">
        <p>
            For example: <span className="font-semibold text-foreground">{currentExample.text}</span> (which is {currentExample.bpm} BPM, by the way)
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
  
  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      <div className="space-y-4 max-w-[calc(42rem+90px)] mx-auto mb-8">
        {songs.map((song, index) => (
          <React.Fragment key={song.id}>
            <SongCard song={song} />
            {(index + 1) % 3 === 0 && <AdBanner />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}


export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  useEffect(() => {
    if (isHomePage) {
      handleSearch(debouncedSearchTerm || DEFAULT_SEARCH_TERM);
    } else {
      setSongs([]);
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, isHomePage, handleSearch]);


  return (
    <>
      <header className="w-full bg-primary">
        <div className={`container mx-auto px-4 py-8 flex items-center justify-center ${isHomePage ? 'pb-20' : 'pb-8'}`}>
          <div className="w-full max-w-[calc(42rem+90px)] text-center">
            <Link href="/" className="text-[100px] font-black text-primary-foreground flex items-center justify-center gap-2">
              TRACK ⚡ BPM
            </Link>
          </div>
        </div>
      </header>
      
      {isHomePage && (
        <>
          <div className="w-full max-w-[calc(42rem+90px)] mx-auto mb-2 relative -mt-[29px]">
            <Input
              type="text"
              placeholder="Search by song title or artist name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-12 py-7 rounded-md shadow-lg bg-card border-2 border-border text-lg"
            />
            {isLoading ? (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground animate-spin" />
            ) : (
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <ExampleSong />
          <SearchResults songs={songs} isLoading={isLoading} searchTerm={debouncedSearchTerm} />
        </>
      )}
    </>
  );
}

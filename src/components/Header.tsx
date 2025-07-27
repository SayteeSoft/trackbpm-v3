
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

function SearchResults({ songs, isLoading, searchTerm }: { songs: Song[], isLoading: boolean, searchTerm: string }) {

  if (isLoading && songs.length === 0) {
    return (
       <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
       </div>
    );
  }

  if (searchTerm.length > 0 && !isLoading && songs.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground py-12">
        No results found for "{searchTerm}".
      </p>
    );
  }
  
  if (songs.length === 0 && !isLoading) {
      return (
          <p className="text-center text-sm text-muted-foreground py-12">
              e.g., <span className="font-semibold text-foreground">Sabrina Carpenter - Espresso</span>
          </p>
      )
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      {songs.length > 0 && (
        <div className="space-y-4 max-w-[calc(42rem+90px)] mx-auto mb-8">
          {songs.map((song, index) => (
            <React.Fragment key={song.id}>
              <SongCard song={song} />
              {(index + 1) % 3 === 0 && <AdBanner />}
            </React.Fragment>
          ))}
        </div>
      )}
       {isLoading && (
         <div className="flex justify-center mt-4">
            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
         </div>
      )}
    </div>
  );
}


export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const [searchTerm, setSearchTerm] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (term: string) => {
    if (!term && isHomePage) {
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
  }, [isHomePage]);

  useEffect(() => {
    if (isHomePage) {
      // On initial mount of the homepage, perform the default search
      handleSearch(DEFAULT_SEARCH_TERM);
    }
    // We only want this to run once on mount for the default search
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHomePage]);

  useEffect(() => {
    // This effect handles user-driven searches with a debounce
    if (!isHomePage) return;

    // Don't run this on the initial render with the default search term
    if (searchTerm === '' || searchTerm === DEFAULT_SEARCH_TERM) return;
    
    const debounceTimeout = setTimeout(() => {
      handleSearch(searchTerm);
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm, handleSearch, isHomePage]);

  useEffect(() => {
      if(!isHomePage){
          setSongs([]);
          setSearchTerm('');
      }
  },[isHomePage])


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
      )}

      {isHomePage && <SearchResults songs={songs} isLoading={isLoading} searchTerm={searchTerm} />}
    </>
  );
}

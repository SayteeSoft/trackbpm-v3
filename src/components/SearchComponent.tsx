
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import SongCard from '@/components/SongCard';
import AdBanner from '@/components/AdBanner';
import { Song } from '@/lib/types';
import { Search, Loader2 } from 'lucide-react';
import { searchSpotifyTracks } from '@/lib/actions';
import { usePathname } from 'next/navigation';

export default function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();

  const isHomePage = pathname === '/';

  const handleSearch = useCallback(async (term: string) => {
    if (!isHomePage) return; // Only search on the homepage

    if (term.length < 3) {
      setSongs([]);
      setError(null);
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
    if (!isHomePage) return;
    
    const debounceTimeout = setTimeout(() => {
      handleSearch(searchTerm);
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm, handleSearch, isHomePage]);

  const showResults = isHomePage && searchTerm.length > 2;

  return (
    <>
      <div className="w-full max-w-[calc(42rem+90px)] mx-auto mb-2 relative" style={{marginTop: isHomePage ? '-59px' : '-29px'}}>
        <Input
          type="text"
          placeholder="Search by song title or artist name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-4 pr-12 py-7 rounded-md shadow-lg bg-card border-2 border-border text-lg"
          disabled={!isHomePage}
        />
        {isLoading ? (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground animate-spin" />
        ) : (
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
        )}
      </div>
      
      {showResults && (
        <div className='container mx-auto px-4 py-8 max-w-4xl'>
          { !isLoading && songs.length === 0 && (
            <p className="text-center text-sm text-muted-foreground mb-12">
              No results found for "{searchTerm}".
            </p>
          )}
          
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
        </div>
      )}

      {isHomePage && searchTerm.length === 0 && !isLoading && (
         <p className="text-center text-sm text-muted-foreground mb-12">
            e.g., <span className="font-semibold text-foreground">Sabrina Carpenter - Espresso</span>
          </p>
      )}
    </>
  );
}

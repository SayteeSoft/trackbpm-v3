
"use client";

import Link from "next/link";
import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import SongCard from '@/components/SongCard';
import AdBanner from '@/components/AdBanner';
import { Song } from '@/lib/types';
import { Search, Loader2 } from 'lucide-react';
import { searchSpotifyTracks } from '@/lib/actions';
import { usePathname } from 'next/navigation';
import Footer from './Footer';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (term: string) => {
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
  }, []);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      handleSearch(searchTerm);
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm, handleSearch]);

  const displayedSongs = songs;

  return (
    <>
      <div className="w-full max-w-[calc(42rem+90px)] mx-auto mb-2 relative -mt-16">
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
      <div className='container mx-auto px-4 py-8 max-w-4xl'>
        {searchTerm.length > 0 && !isLoading && displayedSongs.length === 0 && (
          <p className="text-center text-sm text-muted-foreground mb-12">
            No results found for "{searchTerm}".
          </p>
        )}
        {searchTerm.length === 0 && !isLoading && (
          <p className="text-center text-sm text-muted-foreground mb-12">
            e.g., <span className="font-semibold text-foreground">Sabrina Carpenter - Espresso</span>
          </p>
        )}

        {displayedSongs.length > 0 && (
          <div className="space-y-4 max-w-[calc(42rem+90px)] mx-auto mb-8">
            {displayedSongs.map((song, index) => (
              <React.Fragment key={song.id}>
                <SongCard song={song} />
                {(index + 1) % 3 === 0 && <AdBanner />}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </>
  );
}


export default function Header() {
  const pathname = usePathname();
  const isSongPage = pathname.startsWith('/song/');

  return (
    <>
      <header className="w-full bg-primary">
        <div className={`container mx-auto px-4 py-8 flex items-center justify-center ${!isSongPage ? 'pb-20' : ''}`}>
          <div className="w-full max-w-[calc(42rem+90px)] text-center">
            <Link href="/" className="text-[100px] font-black text-primary-foreground flex items-center justify-center gap-2">
              TRACK ⚡ BPM
            </Link>
          </div>
        </div>
      </header>
       {!isSongPage && <SearchComponent />}
    </>
  );
}
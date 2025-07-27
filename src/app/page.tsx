"use client";

import { useState } from 'react';
import { songs } from '@/lib/data';
import { Input } from '@/components/ui/input';
import SongCard from '@/components/SongCard';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import AdBanner from '@/components/AdBanner';
import { Song } from '@/lib/types';
import { Search } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
  };

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchTerm) ||
      song.artist.toLowerCase().includes(searchTerm)
  );

  const adIndex = 4;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-xl mx-auto mb-8 relative">
            <Input
              type="text"
              placeholder="Search for a song..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-4 pr-10 py-6 rounded-md shadow-md bg-secondary border-none"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>

          {searchTerm.length > 0 && filteredSongs.length > 0 && (
            <div className="max-w-4xl mx-auto space-y-2 mb-8">
              <h2 className="text-xl font-bold mb-4">Search Results</h2>
              {filteredSongs.map((song) => (
                <Link href={`/song/${song.id}`} key={song.id} className="block">
                  <SongCard song={song} />
                </Link>
              ))}
            </div>
          )}

          {searchTerm.length > 0 && filteredSongs.length === 0 && (
             <div className="text-center text-muted-foreground mt-10">
               <p>No songs found for your search.</p>
             </div>
          )}
          
          {searchTerm.length === 0 && (
            <>
              <h2 className="text-xl font-bold mb-4">Trending Songs</h2>
              <div className="max-w-4xl mx-auto space-y-2">
                {songs.slice(0, adIndex).map((song) => (
                  <Link href={`/song/${song.id}`} key={song.id} className="block">
                    <SongCard song={song} />
                  </Link>
                ))}
                <AdBanner />
                {songs.slice(adIndex).map((song) => (
                  <Link href={`/song/${song.id}`} key={song.id} className="block">
                    <SongCard song={song} />
                  </Link>
                ))}
              </div>
            </>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}

"use client";

import React, { useState } from 'react';
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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 w-full">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="w-full max-w-2xl mx-auto mb-2 relative -mt-16">
            <Input
              type="text"
              placeholder="Search by song title or artist name..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-4 pr-12 py-7 rounded-md shadow-lg bg-card border-2 border-border text-lg"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-center text-sm text-muted-foreground mb-12">
            e.g., <span className="font-semibold text-foreground">Sabrina Carpenter - Espresso</span>
          </p>

          {searchTerm.length > 0 && filteredSongs.length > 0 && (
            <div className="space-y-4">
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
            <div className="space-y-4">
              {songs.map((song, index) => (
                <React.Fragment key={song.id}>
                  <Link href={`/song/${song.id}`} className="block">
                    <SongCard song={song} />
                  </Link>
                  {(index + 1) % 3 === 0 && (index + 1) < songs.length && <AdBanner />}
                </React.Fragment>
              ))}
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}

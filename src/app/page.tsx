"use client";

import { useState } from 'react';
import { songs } from '@/lib/data';
import { Input } from '@/components/ui/input';
import SongCard from '@/components/SongCard';
import Footer from '@/components/Footer';
import { Song } from '@/lib/types';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSongs, setFilteredSongs] = useState<Song[]>(songs);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    if (term === '') {
      setFilteredSongs(songs);
    } else {
      const results = songs.filter(
        (song) =>
          song.title.toLowerCase().includes(term) ||
          song.artist.toLowerCase().includes(term)
      );
      setFilteredSongs(results);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <h1 className="text-5xl font-bold tracking-tighter">Track BPM</h1>
            <p className="text-muted-foreground mt-2">
              Find the BPM for any song. Example: <strong>david bowie - space oddity</strong>
            </p>
          </header>

          <div className="max-w-xl mx-auto mb-10 -mt-px">
            <Input
              type="text"
              placeholder="Search for a song or artist..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full text-center"
            />
          </div>

          {filteredSongs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredSongs.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <p>No songs found for your search.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

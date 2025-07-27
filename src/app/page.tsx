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

  const adIndex = 3;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-xl mx-auto mb-2 relative">
            <Input
              type="text"
              placeholder="type a song, get a bpm"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-4 pr-10 py-6 rounded-md shadow-md"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-center text-xs text-muted-foreground mb-10">
            For example: <strong>david bowie - space oddity</strong> (which is 81 BPM, by the way)
          </p>

          {filteredSongs.length > 0 ? (
            <div className="max-w-4xl mx-auto space-y-2">
              {filteredSongs.slice(0, adIndex).map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
              <AdBanner />
              {filteredSongs.slice(adIndex).map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground mt-10">
              <p>No songs found for your search.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

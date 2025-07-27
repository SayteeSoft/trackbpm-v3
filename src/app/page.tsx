"use client";

import React, { useState, useEffect } from 'react';
import { initialSongs } from '@/lib/data';
import { Input } from '@/components/ui/input';
import SongCard from '@/components/SongCard';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import AdBanner from '@/components/AdBanner';
import { Song } from '@/lib/types';
import { Search } from 'lucide-react';
import { getSpotifyTrack } from '@/lib/spotify';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [songs, setSongs] = useState<Song[]>(initialSongs);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);

  useEffect(() => {
    const fetchSongImages = async () => {
      const songsWithImages = await Promise.all(
        initialSongs.map(async (song) => {
          try {
            const track = await getSpotifyTrack(`${song.title} ${song.artist}`);
            if (track && track.album.images.length > 0) {
              return { ...song, imageUrl: track.album.images[0].url };
            }
          } catch (error) {
            console.error(`Failed to fetch image for ${song.title}`, error);
          }
          return song; // Return original song if fetch fails
        })
      );
      setSongs(songsWithImages);
    };

    fetchSongImages();
  }, []);

  useEffect(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    const results = songs.filter(
      (song) =>
        song.title.toLowerCase().includes(lowercasedTerm) ||
        song.artist.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredSongs(results);
  }, [searchTerm, songs]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  const displayedSongs = searchTerm.length > 0 ? filteredSongs : songs;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 w-full">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="w-full max-w-[calc(42rem+60px)] mx-auto mb-2 relative -mt-16">
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

          {displayedSongs.length > 0 ? (
            <div className="space-y-4">
              {displayedSongs.map((song, index) => (
                <React.Fragment key={song.id}>
                  <SongCard song={song} />
                  {(index + 1) % 3 === 0 && (index + 1) < displayedSongs.length && <AdBanner />}
                </React.Fragment>
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

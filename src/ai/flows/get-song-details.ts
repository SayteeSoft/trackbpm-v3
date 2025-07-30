
'use server';

/**
 * @fileOverview An AI agent for getting song details.
 *
 * - getSongDetails - A function that returns the Key, BPM, and Duration for a given song.
 * - SongDetailsInput - The input type for the getSongDetails function.
 * - SongDetailsOutput - The return type for the getSongDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SongDetailsInputSchema = z.object({
  artist: z.string().describe('The artist of the song.'),
  title: z.string().describe('The title of the song.'),
});
export type SongDetailsInput = z.infer<typeof SongDetailsInputSchema>;

const SongDetailsOutputSchema = z.object({
    bpm: z.string().describe('The beats per minute (BPM) of the song.'),
    key: z.string().describe("The musical key of the song (e.g., 'C Major', 'A# Minor')."),
    duration: z.string().describe('The duration of the song in "minutes:seconds" format (e.g., "3:45").'),
});
export type SongDetailsOutput = z.infer<typeof SongDetailsOutputSchema>;

export async function getSongDetails(input: SongDetailsInput): Promise<SongDetailsOutput> {
  return getSongDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getSongDetailsPrompt',
  input: {schema: SongDetailsInputSchema},
  output: {schema: SongDetailsOutputSchema},
  prompt: `You are an AI assistant whose job is to find the Key, BPM, and Duration of a song.

To do this, you will consult leading music data websites. Your knowledge should be based on information from sites like Spotify, Apple Music, Amazon Music, Soundplate.com, Musicstax.com, and Chosic.com. You must synthesize the information from these sources to determine the most accurate and commonly cited Key, BPM, and Duration.

You will be given the artist and title of a song.

- For the Key, use standard notation (e.g., 'C Major', 'A# Minor').
- For the BPM, provide a precise integer value.
- For the Duration, provide it in "minutes:seconds" format (e.g., "3:45").

Do not include any extra words, explanations, or apologies.

Song: {{{title}}} by {{{artist}}}
`,
});

const getSongDetailsFlow = ai.defineFlow(
  {
    name: 'getSongDetailsFlow',
    inputSchema: SongDetailsInputSchema,
    outputSchema: SongDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

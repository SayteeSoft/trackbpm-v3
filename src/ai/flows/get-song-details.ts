'use server';

/**
 * @fileOverview An AI agent for getting song details.
 *
 * - getSongDetails - A function that returns the Key and BPM for a given song.
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
});
export type SongDetailsOutput = z.infer<typeof SongDetailsOutputSchema>;

export async function getSongDetails(input: SongDetailsInput): Promise<SongDetailsOutput> {
  return getSongDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getSongDetailsPrompt',
  input: {schema: SongDetailsInputSchema},
  output: {schema: SongDetailsOutputSchema},
  prompt: `You are a world-class music expert with perfect pitch and a precise sense of timing.

You will be given the artist and title of a song. Provide the song's musical key and its tempo in beats per minute (BPM).

Do not provide any additional information, only the requested fields.

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

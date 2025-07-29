'use server';
/**
 * @fileOverview A music-focused chatbot AI agent.
 *
 * - chat - A function that handles the chatbot conversation.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatInputSchema = z.object({
  message: z.string().describe('The user\'s message to the chatbot.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s response.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: {schema: ChatInputSchema},
  output: {schema: ChatOutputSchema},
  prompt: `You are the "TRACK⚡BPM" Chatbot. Your primary function is to answer questions related to music and songs.

You must only engage in conversations about musical topics.

If a user asks a question that is not about music or songs, you must respond with the exact phrase: "Sorry, I can not help you with anything outside of songs!"

If a user asks about a song that you cannot find, locate, or retrieve, you must suggest similar songs instead.

After every response, whether you found the song or not, you must always ask the user the following question on a new line: "Would you like alternative lyrics to the song or instrumentals you asked about?"

User's message: {{{message}}}
`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

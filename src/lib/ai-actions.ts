
'use server';

import { z } from 'zod';
import { suggestUiFeatures } from '@/ai/flows/suggest-ui-features';
import { chat } from '@/ai/flows/chatbot';

export async function getSuggestedFeatures(appDescription: string): Promise<{suggestions?: string[], error?: string}> {
  const schema = z.string().min(10, { message: 'Please provide a more detailed description (at least 10 characters).' });
  const validation = schema.safeParse(appDescription);
  if (!validation.success) {
    return { error: validation.error.flatten().formErrors[0] };
  }

  try {
    const result = await suggestUiFeatures({ appDescription });
    return { suggestions: result.suggestedFeatures };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to get suggestions from AI. Please try again later.' };
  }
}

export async function chatbot(message: string): Promise<{response?: string, error?: string}> {
    const schema = z.string().min(1, { message: 'Message cannot be empty.' });
    const validation = schema.safeParse(message);
    if (!validation.success) {
        return { error: validation.error.flatten().formErrors[0] };
    }

    try {
        const result = await chat({ message });
        return { response: result.response };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to get response from chatbot. Please try again later.' };
    }
}

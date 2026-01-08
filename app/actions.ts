'use server';

import z from 'zod';
import { postSchema } from './schemas/blog';
import { fetchMutation } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { redirect } from 'next/navigation';
import { getToken } from '@/lib/auth-server';
import { revalidatePath } from 'next/cache';

export async function createBlogArticle(data: z.infer<typeof postSchema>) {
  try {
    const parsed = postSchema.safeParse(data);

    if (!parsed.success) {
      throw new Error('Invalid data');
    }

    const token = await getToken();
    const imageUrl = await fetchMutation(
      api.posts.generateImageUploadUrl,
      {},
      { token }
    );

    const uploadResult = await fetch(imageUrl, {
      method: 'POST',
      headers: {
        'Content-Type': parsed.data.image.type,
      },
      body: parsed.data.image,
    });

    if (!uploadResult.ok) {
      return {
        error: 'Image upload failed',
      };
    }

    const { storageId } = await uploadResult.json();

    await fetchMutation(
      api.posts.createPost,
      {
        title: parsed.data.title,
        body: parsed.data.content,
        imageStorageId: storageId,
      },
      { token }
    );

  } catch {
    return {
      error: 'Post creation failed',
    };
  }
  
  revalidatePath('/blog');
  return redirect('/blog');
}

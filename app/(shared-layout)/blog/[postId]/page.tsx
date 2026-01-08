import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CommentSection } from '@/components/web/CommentSection';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { fetchQuery, preloadQuery } from 'convex/nextjs';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface PostIdProps {
  params: Promise<{
    postId: Id<'posts'>;
  }>;
}

export async function generateMetadata({ params }: PostIdProps) {
  const { postId } = await params;
  const post = await fetchQuery(api.posts.getPostById, { postId: postId });

  if(!post){
    return {
      title: 'Post not found',
      description: 'The requested post does not exist.',
    };
  }
  
  return {
    title: post.title,
    description: post.body,
  };
}

const BlogDetails = async ({ params }: PostIdProps) => {
  const { postId } = await params;

  const [post,preLoadedComments] = await Promise.all([
    await fetchQuery(api.posts.getPostById, { postId: postId }),
    await preloadQuery(api.comments.getCommentsByPost, {
      postId: postId,
    })
  ]);

  if (!post) {
    return (
      <div>
        <h1 className="text-6xl font-extrabold text-red-500 p-20">
          No post found
        </h1>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative">
      <Link
        href="/blog"
        className={buttonVariants({ variant: 'secondary',className: 'mb-6' })}
      >
        <ArrowLeft className="size-4" />
        Back to blogs
      </Link>

      <div className="relative w-full h-100 mb-8 rounded-xl overflow-hidden shadow-sm">
        <Image
          src={post.imageUrl ?? '/placeholder-v.png'}
          alt={post.title}
          fill
          className={`object-cover hover:scale-105 transition-transform duration-500 ${
            post.imageUrl ? 'object-cover' : 'object-contain'
          }`}
        />
      </div>

      <div className="space-y-4 flex flex-col">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {post.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          Posted on: {new Date(post._creationTime).toLocaleDateString()}
        </p>
      </div>
      <Separator className="my-8" />

      <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
        {post.body}
      </p>

      <Separator className="my-8" />

      <CommentSection preLoadedComments={preLoadedComments} />
    </div> 
  );
};

export default BlogDetails;

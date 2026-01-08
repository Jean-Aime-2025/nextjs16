import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

const BlogPage = async () => {
  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-5xl">
          Blog posts
        </h1>
        <p className="text-xl text-muted-foreground py-4">
          Different thoughts from others over the internet.
        </p>
      </div>
      <Suspense fallback={<SkeletonLoadingUI />}>
        <LoadingBlogList />
      </Suspense>
    </div>
  );
};

export default BlogPage;

async function LoadingBlogList() {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const data = await fetchQuery(api.posts.getPosts);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data?.map((post) => (
        <Card key={post._id} className="pt-0">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={post.imageUrl || '/placeholder-v.png'}
              alt="image"
              fill
              className={`rounded-t-lg ${
                post.imageUrl ? 'object-cover' : 'object-contain'
              }`}
            />
          </div>

          <CardContent>
            <Link href={`/blog/${post._id}`}>
              <h1 className="text-2xl font-semibold hover:text-primary capitalize">
                {post.title}
              </h1>
            </Link>
            <p className="text-muted-foreground line-clamp-3 capitalize">
              {post.body}
            </p>
          </CardContent>

          <CardFooter>
            <Link
              href={`/blog/${post._id}`}
              className={buttonVariants({
                className: 'w-full',
              })}
            >
              Read more
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function SkeletonLoadingUI() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="flex flex-col space-y-3">
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="space-y-2 flex flex-col">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

'use client';

import { Loader2, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { commentSchema } from '@/app/schemas/comment';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { Button } from '../ui/button';
import { useParams } from 'next/navigation';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation, usePreloadedQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import z from 'zod';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import CommentSkeleton from './CommentSkeleton';
import { Textarea } from '../ui/textarea';
import { Preloaded } from 'convex/react';

export function CommentSection(props:{
  preLoadedComments: Preloaded<typeof api.comments.getCommentsByPost>;
}) {
  const params = useParams<{ postId: Id<'posts'> }>();
  const data = usePreloadedQuery(props.preLoadedComments);
  const [isPending, startTransition] = useTransition();
  const createComment = useMutation(api.comments.createComment);
  const form = useForm({
    resolver: zodResolver(commentSchema),
    mode: 'onChange',
    defaultValues: {
      body: '',
      postId: params.postId,
    },
  });

  async function onSubmit(data: z.infer<typeof commentSchema>) {
    startTransition(async () => {
      try {
        await createComment(data);
        form.reset();
        toast.success('Comment created successfully!');
      } catch {
        toast.error('Failed to create comment.');
      }
    });
  }

  const isLoading = data === undefined;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 border-b">
        <MessageSquare className="size-5" />
        <h2 className="text-xl">{data?.length} Comments</h2>
      </CardHeader>
      <CardContent className="space-y-8">
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="body"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Comment</FieldLabel>
                <Textarea
                  aria-invalid={fieldState.invalid}
                  placeholder="Cool blog content"
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="flex w-full items-end justify-end">
            <Button
              disabled={
                isPending || !form.formState.isValid || !form.formState.isDirty
              }
              type="submit"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Please wait...</span>
                </>
              ) : (
                <span>Comment</span>
              )}
            </Button>
          </div>
        </form>

        {isLoading && (
          <section className="space-y-6">
            <CommentSkeleton />
            <CommentSkeleton />
            <CommentSkeleton />
          </section>
        )}

        {!isLoading && data.length > 0 && <Separator />}

        <section className="space-y-6">
          {data?.map((comment) => (
            <div key={comment._id} className="flex items-center gap-4">
              <Avatar className="size-10 shrink-0">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${comment.authorName}`}
                />
                <AvatarFallback>
                  {comment.authorName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">{comment.authorName}</p>
                  <p className="text-muted-foreground text-xs">
                    {new Date(comment._creationTime).toLocaleDateString(
                      'en-US'
                    )}
                  </p>
                </div>

                <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {comment.body}
                </p>
              </div>
            </div>
          ))}
        </section>
      </CardContent>
    </Card>
  );
}

/* eslint-disable @next/next/no-img-element */
'use client';

import { createBlogArticle } from '@/app/actions';
import { postSchema } from '@/app/schemas/blog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { UploadCloud, X } from 'lucide-react';

const CreatePage = () => {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
      image: undefined,
    },
  });

  function onSubmit(data: z.infer<typeof postSchema>) {
    startTransition(async () => {
      await createBlogArticle(data);
    });
  }

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-5xl">
          Create a post
        </h1>
        <p className="text-xl text-muted-foreground py-4">
          Share your thoughts with others.
        </p>
      </div>

      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Create Blog Article</CardTitle>
          <CardDescription>Create a new blog article</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-y-4">
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Title</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      type="text"
                      placeholder="Cool title"
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="content"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Content</FieldLabel>
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
              <Controller
                name="image"
                control={form.control}
                render={({ field, fieldState }) => {
                  const file = field.value as File | undefined;
                  const preview = file ? URL.createObjectURL(file) : null;

                  return (
                    <Field>
                      <FieldLabel>Cover Image</FieldLabel>

                      <div
                        className={`
                          relative flex flex-col items-center justify-center
                          border-2 border-dashed rounded-xl p-6
                          transition cursor-pointer
                          ${
                            fieldState.invalid
                              ? 'border-destructive'
                              : 'border-muted-foreground/30 hover:border-primary'
                          }
                        `}
                      >
                        {/* Hidden input */}
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            field.onChange(file);
                          }}
                        />

                        {/* Preview */}
                        {preview ? (
                          <div className="relative w-full">
                            <img
                              src={preview}
                              alt="Preview"
                              className="h-48 w-full object-contain rounded-lg"
                            />

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                field.onChange(undefined);
                              }}
                              className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Click to upload or drag & drop
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG, WEBP (max 5MB)
                            </p>
                          </>
                        )}
                      </div>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  );
                }}
              />

              <Button
                disabled={isPending}
                type="submit"
                className="w-full mt-4"
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Please wait...</span>
                  </>
                ) : (
                  <span>Create Post</span>
                )}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePage;

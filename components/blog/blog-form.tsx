"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BlogEditor } from "@/components/blog/blog-editor";

interface BlogFormData {
  title: string;
  content: string;
  coverImage: string;
  tags: string;
}

interface BlogFormProps {
  initialData?: Partial<BlogFormData>;
  onSubmit: (data: BlogFormData) => void;
  isLoading: boolean;
  mode?: "create" | "edit";
}

export function BlogForm({
  initialData,
  onSubmit,
  isLoading,
  mode = "create",
}: BlogFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage ?? "");
  const [tags, setTags] = useState(initialData?.tags ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!title || title.trim().length < 3) {
      errs.title = "Title must be at least 3 characters.";
    }
    if (!coverImage || !coverImage.startsWith("http")) {
      errs.coverImage = "Please enter a valid image URL.";
    }
    if (!content || content.replace(/<[^>]*>/g, "").trim().length < 10) {
      errs.content = "Content must be at least 10 characters.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ title: title.trim(), content, coverImage: coverImage.trim(), tags: tags.trim() });
  }

  const isValidImageUrl =
    coverImage.startsWith("http://") || coverImage.startsWith("https://");

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Blog post title"
          required
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title}</p>
        )}
      </div>

      {/* Cover Image */}
      <div className="space-y-2">
        <Label htmlFor="coverImage">Cover Image</Label>
        <Input
          id="coverImage"
          type="url"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          placeholder="https://images.unsplash.com/..."
          required
        />
        {errors.coverImage && (
          <p className="text-sm text-destructive">{errors.coverImage}</p>
        )}
        {isValidImageUrl && (
          <div className="aspect-video rounded-lg overflow-hidden border">
            <img
              src={coverImage}
              alt="Cover preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="technology, events, tips"
        />
        <p className="text-xs text-muted-foreground">
          Separate tags with commas
        </p>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Label>Content</Label>
        <BlogEditor content={content} onChange={setContent} editable />
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content}</p>
        )}
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {mode === "create" ? "Publish Post" : "Update Post"}
      </Button>
    </form>
  );
}

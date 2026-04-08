"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { BlogPost } from "@/hooks/use-blog";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const tags = post.tags
    ? post.tags
        .split(",")
        .filter(Boolean)
        .map((t) => t.trim())
    : [];

  return (
    <Card className="overflow-hidden group transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
      {/* Image Area */}
      <div className="relative aspect-video overflow-hidden">
        {!imageLoaded && <Skeleton className="absolute inset-0" />}
        <img
          src={post.coverImage || "/placeholder-event.jpg"}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-event.jpg";
            setImageLoaded(true);
          }}
        />
      </div>

      {/* Content Area */}
      <CardContent className="p-4 space-y-2">
        <CardTitle className="text-base font-semibold line-clamp-1">
          {post.title}
        </CardTitle>
        {post.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {post.excerpt}
          </p>
        )}
        {/* Meta */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{post.author?.name || "Unknown"}</span>
          <span>&middot;</span>
          <span>{formattedDate}</span>
        </div>
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Badge variant="outline" key={tag}>
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" variant="secondary" asChild>
          <Link href={`/blog/${post.id}`}>Read More</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

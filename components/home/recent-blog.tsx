import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface RecentBlogProps {
  posts?: {
    id: string;
    title: string;
    excerpt: string;
    coverImage: string;
    author: { name: string };
    createdAt: string;
    tags: string;
  }[];
}

export function RecentBlog({ posts }: RecentBlogProps) {
  return (
    <section className="py-16 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-semibold text-center">
            Latest from Our Blog
          </h2>
          <Link
            href="/blog"
            className="text-primary hover:underline text-sm font-medium flex items-center gap-1"
          >
            View All Posts <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {!posts || posts.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No blog posts yet
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => {
              const tagList = post.tags
                ? post.tags.split(",").map((t) => t.trim()).filter(Boolean)
                : [];
              return (
                <Card
                  key={post.id}
                  className="overflow-hidden group transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                >
                  {/* Cover Image */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={post.coverImage || "/placeholder-event.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/placeholder-event.svg";
                      }}
                    />
                  </div>

                  {/* Content */}
                  <CardContent className="p-4 space-y-2">
                    <h3 className="text-base font-semibold line-clamp-1">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{post.author.name}</span>
                      <span>-</span>
                      <span>
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    {tagList.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {tagList.map((tag) => (
                          <Badge key={tag} variant="outline">
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
            })}
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FileText, PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { BlogCard } from "@/components/blog/blog-card";
import { BlogCardSkeleton } from "@/components/blog/blog-card-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useBlogPosts } from "@/hooks/use-blog";
import { useAuth } from "@/lib/auth";

function BlogPageContent() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const { data, isLoading, isError } = useBlogPosts(page, 12);
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold">Blog</h1>
        {user && (
          <Button asChild>
            <Link href="/blog/create">
              <PenSquare className="mr-2 h-4 w-4" />
              Write a Post
            </Link>
          </Button>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <EmptyState
          icon={FileText}
          heading="Something went wrong"
          body="Please try again or refresh the page."
        />
      )}

      {/* Empty State */}
      {!isLoading && !isError && (!data?.posts || data.posts.length === 0) && (
        <EmptyState
          icon={FileText}
          heading="No blog posts yet"
          body="Be the first to share your thoughts. Create a blog post now."
          ctaLabel={user ? "Write a Post" : undefined}
          ctaHref={user ? "/blog/create" : undefined}
        />
      )}

      {/* Blog Grid */}
      {!isLoading && !isError && data?.posts && data.posts.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  {page > 1 && (
                    <PaginationItem>
                      <PaginationPrevious href={`/blog?page=${page - 1}`} />
                    </PaginationItem>
                  )}

                  {Array.from({ length: data.totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    // Show first, last, current, and adjacent pages
                    if (
                      pageNum === 1 ||
                      pageNum === data.totalPages ||
                      Math.abs(pageNum - page) <= 1
                    ) {
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href={`/blog?page=${pageNum}`}
                            isActive={pageNum === page}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    // Show ellipsis for gaps
                    if (
                      pageNum === 2 && page > 3 ||
                      pageNum === data.totalPages - 1 && page < data.totalPages - 2
                    ) {
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}

                  {page < data.totalPages && (
                    <PaginationItem>
                      <PaginationNext href={`/blog?page=${page + 1}`} />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense>
      <BlogPageContent />
    </Suspense>
  );
}

"use client";

import { useHomepageData } from "@/hooks/use-homepage";
import { AnimatedSection } from "@/components/shared/animated-section";

import { HeroSection } from "@/components/home/hero-section";
import { HowItWorks } from "@/components/home/how-it-works";
import { UpcomingGrid } from "@/components/home/upcoming-grid";
import { PaidEventsGrid } from "@/components/home/paid-events-grid";
import { CategoryFilters } from "@/components/home/category-filters";
import { PlatformStats } from "@/components/home/platform-stats";
import { FeaturedOrganizers } from "@/components/home/featured-organizers";
import { Testimonials } from "@/components/home/testimonials";
import { RecentBlog } from "@/components/home/recent-blog";
import { NewsletterSignup } from "@/components/home/newsletter-signup";
import { FaqSection } from "@/components/home/faq-section";
import { CtaSection } from "@/components/home/cta-section";

export default function HomePage() {
  const { data, isLoading } = useHomepageData();

  return (
    <main id="main-content">
      <HeroSection featuredEvents={data?.featuredEvents} isLoading={isLoading} />
      <AnimatedSection>
        <HowItWorks />
      </AnimatedSection>
      <AnimatedSection>
        <UpcomingGrid events={data?.upcomingEvents} isLoading={isLoading} />
      </AnimatedSection>
      <AnimatedSection>
        <PaidEventsGrid events={data?.paidEvents} isLoading={isLoading} />
      </AnimatedSection>
      <AnimatedSection>
        <CategoryFilters categoryCounts={data?.categoryCounts} />
      </AnimatedSection>
      <AnimatedSection>
        <PlatformStats stats={data?.platformStats} />
      </AnimatedSection>
      <AnimatedSection>
        <FeaturedOrganizers organizers={data?.topOrganizers} />
      </AnimatedSection>
      <Testimonials testimonials={data?.testimonials || []} />
      <AnimatedSection>
        <RecentBlog posts={data?.recentBlogPosts} />
      </AnimatedSection>
      <AnimatedSection>
        <NewsletterSignup />
      </AnimatedSection>
      <AnimatedSection>
        <FaqSection />
      </AnimatedSection>
      <AnimatedSection>
        <CtaSection />
      </AnimatedSection>
    </main>
  );
}

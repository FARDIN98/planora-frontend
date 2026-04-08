"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, Users, UserCheck, Star } from "lucide-react";

interface PlatformStatsProps {
  stats?: {
    totalEvents: number;
    totalUsers: number;
    totalRegistrations: number;
    totalReviews: number;
  };
}

const statItems = [
  { key: "totalEvents" as const, label: "Total Events", icon: Calendar },
  { key: "totalUsers" as const, label: "Active Users", icon: Users },
  {
    key: "totalRegistrations" as const,
    label: "Registrations",
    icon: UserCheck,
  },
  { key: "totalReviews" as const, label: "Reviews", icon: Star },
];

function useCountUp(target: number, duration = 2000, shouldStart = false) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!shouldStart || hasAnimated.current || target === 0) return;
    hasAnimated.current = true;

    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };
    requestAnimationFrame(animate);
  }, [target, duration, shouldStart]);

  return count;
}

function StatCounter({
  value,
  label,
  icon: Icon,
  isInView,
}: {
  value: number;
  label: string;
  icon: React.ElementType;
  isInView: boolean;
}) {
  const displayCount = useCountUp(value, 2000, isInView);

  return (
    <div className="text-center space-y-2">
      <div className="mx-auto p-3 rounded-full bg-primary/10 text-primary w-fit">
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-3xl font-semibold">{displayCount.toLocaleString()}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export function PlatformStats({ stats }: PlatformStatsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-center mb-10">
          Platform Statistics
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((item) => (
            <StatCounter
              key={item.key}
              value={stats?.[item.key] ?? 0}
              label={item.label}
              icon={item.icon}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

import React from "react";

/**
 * Skeleton loader for shimmer loading states.
 * Use for cards, lists, and content placeholders.
 */
const Skeleton = ({ className = "", width, height }) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width: width || "100%", height: height || "1rem" }}
    />
  );
};

export const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
    <Skeleton height="1.5rem" className="w-3/4" />
    <Skeleton height="1rem" />
    <Skeleton height="1rem" className="w-5/6" />
    <div className="flex gap-2 pt-2">
      <Skeleton height="2rem" className="w-20 rounded-2xl" />
      <Skeleton height="2rem" className="w-24 rounded-2xl" />
    </div>
  </div>
);

export const SkeletonDashboardCard = () => (
  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <Skeleton height="0.875rem" className="w-16" />
        <Skeleton height="2rem" className="w-12" />
      </div>
      <Skeleton height="2.5rem" className="w-10 rounded-2xl" />
    </div>
  </div>
);

export const SkeletonList = ({ rows = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-200">
        <Skeleton height="2.5rem" className="w-12 rounded-2xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton height="1rem" className="w-3/4" />
          <Skeleton height="0.75rem" className="w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;

import React, { useContext, useState } from "react";
import { useExternalLearning } from "@/context/ExternalLearningContext";
import PlatformCard from "./PlatformCard";
import CourseGridCard from "./CourseGridCard";
import { FiSearch, FiFilter, FiStar } from "react-icons/fi";
import useAuth from "@/hooks/useAuth";

const ExternalLearningPage = () => {
  const { getPlatforms, getFeaturedCourses, getPlatformById, openCourseUrl } = useExternalLearning();
  const { user } = useAuth();
  const platforms = getPlatforms();
  const featuredCourses = getFeaturedCourses(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categories = ["All", ...new Set(platforms.map((p) => p.category).filter(Boolean))];
  const filteredPlatforms = platforms.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenCourse = (course, platform) => {
    const platformData = platform || getPlatformById(course.platformId);
    openCourseUrl(course, platformData, user?._id);
  };

  return (
    <div className="p-4 px-8">
      <div className="page-header-subtle mb-8">
        <h1 className="heading-1">External Learning</h1>
        <p className="text-gray-600 mt-1">
          Browse and explore courses from top learning platforms. Click to open in a new tab.
        </p>
      </div>

      {/* Popular Now / Featured */}
      {featuredCourses.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiStar className="text-amber-500" /> Popular Now
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {featuredCourses.map((course) => {
              const platform = getPlatformById(course.platformId);
              return (
                <CourseGridCard
                  key={course.id}
                  course={course}
                  platform={platform}
                  onOpenCourse={handleOpenCourse}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Recommended For You placeholder */}
      <section className="mb-10 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Recommended For You</h2>
        <p className="text-gray-600 text-sm">
          Personalized recommendations based on your learning history will appear here.
        </p>
      </section>

      {/* Platforms */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Learning Platforms</h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search platforms..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative sm:w-48">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white transition-all duration-200"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlatforms.map((platform) => (
            <PlatformCard key={platform.id} platform={platform} />
          ))}
        </div>
        {filteredPlatforms.length === 0 && (
          <p className="text-gray-500 text-center py-8">No platforms match your filters.</p>
        )}
      </section>
    </div>
  );
};

export default ExternalLearningPage;

import React, { useContext, useState } from "react";
import { useParams, Link } from "react-router";
import { useExternalLearning } from "@/context/ExternalLearningContext";
import CourseGridCard from "./CourseGridCard";
import { FiArrowLeft, FiSearch, FiFilter } from "react-icons/fi";
import useAuth from "@/hooks/useAuth";

const ExternalPlatformDetailPage = () => {
  const { platformId } = useParams();
  const { getPlatformById, getCoursesByPlatform, openCourseUrl } = useExternalLearning();
  const { user } = useAuth();
  const platform = getPlatformById(platformId);
  const courses = getCoursesByPlatform(platformId);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");

  const categories = ["All", ...new Set(courses.map((c) => c.category).filter(Boolean))];
  const levels = ["All", ...new Set(courses.map((c) => c.level).filter(Boolean))];

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.tags || []).some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "All" || c.category === categoryFilter;
    const matchesLevel = levelFilter === "All" || c.level === levelFilter;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const featuredCourses = filteredCourses.filter((c) => c.isFeatured);
  const otherCourses = filteredCourses.filter((c) => !c.isFeatured);

  const handleOpenCourse = (course) => openCourseUrl(course, platform, user?._id);

  if (!platform) {
    return (
      <div className="p-8">
        <p className="text-gray-600">Platform not found.</p>
        <Link to="/external-learning" className="text-indigo-600 hover:underline mt-2 inline-block">
          Back to External Learning
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 px-8">
      <Link
        to="/external-learning"
        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6"
      >
        <FiArrowLeft /> Back to platforms
      </Link>

      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-white rounded-lg shadow-sm">
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          {platform.logoUrl ? (
            <img src={platform.logoUrl} alt={platform.name} className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
              {platform.name.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{platform.name}</h1>
          <p className="text-gray-600 mt-1">{platform.description}</p>
          <span className="inline-block mt-2 px-2 py-1 rounded text-xs bg-indigo-100 text-indigo-700">
            {platform.category}
          </span>
        </div>
      </div>

      {/* Search & filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="relative sm:w-40">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
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
          <select
            className="w-full sm:w-36 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
          >
            {levels.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Featured courses */}
      {featuredCourses.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Featured Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredCourses.map((course) => (
              <CourseGridCard
                key={course.id}
                course={course}
                platform={platform}
                onOpenCourse={handleOpenCourse}
              />
            ))}
          </div>
        </section>
      )}

      {/* All courses */}
      <section>
        <h2 className="text-lg font-semibold mb-4">All Courses ({filteredCourses.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {otherCourses.map((course) => (
            <CourseGridCard
              key={course.id}
              course={course}
              platform={platform}
              onOpenCourse={handleOpenCourse}
            />
          ))}
        </div>
        {filteredCourses.length === 0 && (
          <p className="text-gray-500 text-center py-8">No courses match your filters.</p>
        )}
      </section>
    </div>
  );
};

export default ExternalPlatformDetailPage;

import React, { useContext, useState } from "react";
import { Link } from "react-router";
import { AcademicsContext } from "@/context/AcademicsContext";
import useAuth from "@/hooks/useAuth";
import Card from "@/components/common/Card";
import { FiSearch, FiFilter, FiPlus, FiBook } from "react-icons/fi";
import Loader from "@/components/common/Loader";

const STATUS_COLORS = { Draft: "bg-gray-200 text-gray-700", Published: "bg-green-200 text-green-800", Archived: "bg-amber-200 text-amber-800" };
const LEVEL_COLORS = { Beginner: "bg-blue-100 text-blue-800", Intermediate: "bg-amber-100 text-amber-800", Advanced: "bg-red-100 text-red-800" };

const CoursesPage = () => {
  const { courses, loading, deleteCourse } = useContext(AcademicsContext);
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterLevel, setFilterLevel] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const canManage = user?.role === "admin" || user?.role === "Admin" || user?.role === "staff" || user?.role === "Staff";
  const publishedOnly = !canManage;

  const filtered = courses.filter((c) => {
    const matchSearch =
      c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = filterCategory === "All" || c.category === filterCategory;
    const matchLevel = filterLevel === "All" || c.level === filterLevel;
    const matchStatus = filterStatus === "All" || c.status === filterStatus;
    const matchPublished = publishedOnly ? c.status === "Published" : true;
    return matchSearch && matchCat && matchLevel && matchStatus && matchPublished;
  });

  const categories = [...new Set(courses.map((c) => c.category).filter(Boolean))];
  const levels = ["Beginner", "Intermediate", "Advanced"];
  const statuses = ["Draft", "Published", "Archived"];

  if (loading) return <Loader />;

  return (
    <div>
      <div className="p-4 px-8 mb-8 shadow">
        <h4 className="text-3xl font-semibold">Courses</h4>
      </div>
      <div className="px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative w-64">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
            >
              <option value="All">All Levels</option>
              {levels.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            {canManage && (
              <select
                className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            )}
          </div>
          {canManage && (
            <Link
              to="/courses/new"
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
            >
              <FiPlus /> Add Course
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <Card key={course._id} customClass="bg-white shadow hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <FiBook className="text-indigo-600" size={24} />
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[course.status] || "bg-gray-200"}`}>
                  {course.status}
                </span>
              </div>
              <h5 className="font-bold text-lg mb-1">{course.title}</h5>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2 py-0.5 rounded text-xs ${LEVEL_COLORS[course.level] || "bg-gray-100"}`}>
                  {course.level}
                </span>
                <span className="text-xs text-gray-500">{course.category}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span>{course.enrolledCount ?? 0} enrolled</span>
                <span>{course.completionRate ?? 0}% completion</span>
              </div>
              <Link
                to={`/courses/${course._id}`}
                className="block w-full text-center py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium"
              >
                View Course
              </Link>
            </Card>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">No courses found.</div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;

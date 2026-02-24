import React from "react";
import Card from "@/components/common/Card";
import { FiExternalLink } from "react-icons/fi";

const CourseGridCard = ({ course, platform, onOpenCourse }) => {
  return (
    <Card customClass={`h-full flex flex-col relative overflow-hidden ${course.isFeatured ? "card-featured" : ""}`}>
      {course.isFeatured && (
        <div className="absolute top-3 right-3 z-10">
          <span className="badge-featured shadow-sm">Featured</span>
        </div>
      )}
      <div className="flex flex-col h-full">
        <div className="flex-1 p-4">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-32 object-cover rounded-xl mb-3"
            />
          ) : (
            <div className="w-full h-32 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl mb-3 flex items-center justify-center">
              <span className="text-2xl font-semibold text-gray-400">{course.title.charAt(0)}</span>
            </div>
          )}
          <h3 className="font-bold text-gray-900 line-clamp-2">{course.title}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{course.description}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            <span className="px-2 py-0.5 rounded text-xs bg-gray-100">{course.level}</span>
            <span className="badge-featured">{course.category}</span>
          </div>
          {course.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {course.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs text-gray-500">#{tag}</span>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => onOpenCourse(course, platform)}
            className="btn-primary w-full flex items-center justify-center gap-2 font-medium text-sm"
          >
            <FiExternalLink size={16} /> Open Course
          </button>
        </div>
      </div>
    </Card>
  );
};

export default CourseGridCard;

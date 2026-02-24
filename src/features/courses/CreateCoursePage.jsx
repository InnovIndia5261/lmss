import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AcademicsContext } from "@/context/AcademicsContext";
import Card from "@/components/common/Card";
import Loader from "@/components/common/Loader";

const CreateCoursePage = () => {
  const { addCourse, loading } = useContext(AcademicsContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Programming",
    level: "Beginner",
    status: "Draft",
    enrollmentLimit: 100,
    hasCertificate: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const course = await addCourse({
      ...form,
      organizationId: "org-1",
      instructorId: "current-user",
      instructorName: "Current User",
    });
    if (course) navigate(`/courses/${course._id}`);
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="p-4 px-8 mb-8 shadow">
        <h4 className="text-3xl font-semibold">Create Course</h4>
      </div>
      <div className="px-8 max-w-2xl">
        <Card customClass="bg-white shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Course title"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Course description"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="Programming">Programming</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Data Science">Data Science</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                <select
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Limit</label>
                <input
                  name="enrollmentLimit"
                  type="number"
                  value={form.enrollmentLimit}
                  onChange={handleChange}
                  min={1}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  name="hasCertificate"
                  checked={form.hasCertificate}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <label>Certificate on completion</label>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium"
              >
                Create Course
              </button>
              <button
                type="button"
                onClick={() => navigate("/courses")}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateCoursePage;

import React, { useContext, useState } from "react";
import { useExternalLearning } from "@/context/ExternalLearningContext";
import useAuth from "@/hooks/useAuth";
import Card from "@/components/common/Card";
import { FiTrendingUp, FiPlus, FiTrash2 } from "react-icons/fi";
import Modal from "@/components/common/modal";

const ExternalLearningAdminPage = () => {
  const {
    getPlatforms,
    getCourses,
    getMostClickedPlatforms,
    getMostClickedCourses,
    createPlatform,
    createCourse,
    deletePlatform,
    deleteCourse,
  } = useExternalLearning();
  const { user } = useAuth();
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [platformForm, setPlatformForm] = useState({
    name: "",
    logoUrl: "",
    baseUrl: "",
    description: "",
    category: "",
    affiliateTag: "",
    affiliateTrackingEnabled: false,
    isActive: true,
  });
  const [courseForm, setCourseForm] = useState({
    platformId: "",
    title: "",
    description: "",
    category: "",
    level: "Beginner",
    externalUrl: "",
    tags: "",
    isFeatured: false,
  });

  const orgPlatforms = getPlatforms();
  const orgCourses = getCourses();
  const mostClickedPlatforms = getMostClickedPlatforms(5);
  const mostClickedCourses = getMostClickedCourses(10);

  const handleCreatePlatform = async (e) => {
    e.preventDefault();
    const { response } = await createPlatform({
      ...platformForm,
      affiliateTag: platformForm.affiliateTag || null,
    });
    if (response?.data) {
      setShowPlatformModal(false);
      setPlatformForm({ name: "", logoUrl: "", baseUrl: "", description: "", category: "", affiliateTag: "", affiliateTrackingEnabled: false, isActive: true });
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    const { response } = await createCourse({
      ...courseForm,
      tags: courseForm.tags ? courseForm.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    });
    if (response?.data) {
      setShowCourseModal(false);
      setCourseForm({ platformId: "", title: "", description: "", category: "", level: "Beginner", externalUrl: "", tags: "", isFeatured: false });
    }
  };

  const handleDeletePlatform = async (id) => {
    if (window.confirm("Delete this platform? Courses will be orphaned.")) {
      await deletePlatform(id);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm("Delete this course?")) {
      await deleteCourse(id);
    }
  };

  const isAdmin = user?.role === "admin" || user?.role === "Admin";
  if (!isAdmin) {
    return (
      <div className="p-8">
        <p className="text-gray-600">Access denied. Admin only.</p>
      </div>
    );
  }

  return (
    <div className="p-4 px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">External Learning Admin</h1>
        <p className="text-gray-600 mt-1">Manage platforms, courses, and view analytics.</p>
      </div>

      {/* Analytics */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FiTrendingUp /> Click Analytics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card customClass="bg-white shadow">
            <h3 className="font-semibold mb-3">Most Clicked Platforms</h3>
            {mostClickedPlatforms.length > 0 ? (
              <ul className="space-y-2">
                {mostClickedPlatforms.map((p) => (
                  <li key={p.id} className="flex justify-between items-center">
                    <span>{p.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No clicks yet.</p>
            )}
          </Card>
          <Card customClass="bg-white shadow">
            <h3 className="font-semibold mb-3">Most Clicked Courses</h3>
            {mostClickedCourses.length > 0 ? (
              <ul className="space-y-2 max-h-48 overflow-y-auto">
                {mostClickedCourses.map((c) => (
                  <li key={c.id} className="text-sm">
                    {c.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No clicks yet.</p>
            )}
          </Card>
        </div>
      </section>

      {/* Platforms */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Platforms</h2>
          <button
            onClick={() => setShowPlatformModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            <FiPlus /> Add Platform
          </button>
        </div>
        <div className="space-y-2">
          {orgPlatforms.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-4 bg-white border rounded-lg">
              <div className="flex items-center gap-3">
                {p.logoUrl && <img src={p.logoUrl} alt="" className="w-10 h-10 object-contain" />}
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-gray-500">{p.category}</div>
                </div>
              </div>
              <button
                onClick={() => handleDeletePlatform(p.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Courses</h2>
          <button
            onClick={() => setShowCourseModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            <FiPlus /> Add Course
          </button>
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {orgCourses.slice(0, 20).map((c) => (
            <div key={c.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
              <div>
                <div className="font-medium">{c.title}</div>
                <div className="text-sm text-gray-500">{orgPlatforms.find((p) => p.id === c.platformId)?.name}</div>
              </div>
              <button
                onClick={() => handleDeleteCourse(c.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Add Platform Modal */}
      <Modal open={showPlatformModal} onClose={() => setShowPlatformModal(false)} title="Add Platform">
        <form onSubmit={handleCreatePlatform} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              required
              className="w-full border rounded px-3 py-2"
              value={platformForm.name}
              onChange={(e) => setPlatformForm({ ...platformForm, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Logo URL</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={platformForm.logoUrl}
              onChange={(e) => setPlatformForm({ ...platformForm, logoUrl: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Base URL</label>
            <input
              required
              className="w-full border rounded px-3 py-2"
              value={platformForm.baseUrl}
              onChange={(e) => setPlatformForm({ ...platformForm, baseUrl: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              value={platformForm.description}
              onChange={(e) => setPlatformForm({ ...platformForm, description: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={platformForm.category}
              onChange={(e) => setPlatformForm({ ...platformForm, category: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Affiliate Tag</label>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Optional"
              value={platformForm.affiliateTag}
              onChange={(e) => setPlatformForm({ ...platformForm, affiliateTag: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={platformForm.affiliateTrackingEnabled}
              onChange={(e) => setPlatformForm({ ...platformForm, affiliateTrackingEnabled: e.target.checked })}
            />
            <label>Affiliate tracking enabled</label>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowPlatformModal(false)} className="px-4 py-2 border rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
              Add
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Course Modal */}
      <Modal open={showCourseModal} onClose={() => setShowCourseModal(false)} title="Add Course">
        <form onSubmit={handleCreateCourse} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Platform</label>
            <select
              required
              className="w-full border rounded px-3 py-2"
              value={courseForm.platformId}
              onChange={(e) => setCourseForm({ ...courseForm, platformId: e.target.value })}
            >
              <option value="">Select platform</option>
              {orgPlatforms.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              required
              className="w-full border rounded px-3 py-2"
              value={courseForm.title}
              onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">External URL</label>
            <input
              required
              className="w-full border rounded px-3 py-2"
              value={courseForm.externalUrl}
              onChange={(e) => setCourseForm({ ...courseForm, externalUrl: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              value={courseForm.description}
              onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={courseForm.category}
              onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Level</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={courseForm.level}
              onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={courseForm.tags}
              onChange={(e) => setCourseForm({ ...courseForm, tags: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={courseForm.isFeatured}
              onChange={(e) => setCourseForm({ ...courseForm, isFeatured: e.target.checked })}
            />
            <label>Featured</label>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowCourseModal(false)} className="px-4 py-2 border rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
              Add
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ExternalLearningAdminPage;

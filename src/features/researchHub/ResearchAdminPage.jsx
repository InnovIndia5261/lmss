import React, { useState } from "react";
import { useResearch } from "@/context/ResearchContext";
import useAuth from "@/hooks/useAuth";
import Card from "@/components/common/Card";
import Modal from "@/components/common/modal";
import { FiTrendingUp, FiPlus, FiTrash2 } from "react-icons/fi";

const getPlatformLogoSrc = (platform) => {
  if (platform?.logoUrl?.startsWith("/")) return platform.logoUrl;
  const slug = platform?.name?.toLowerCase().replace(/\s+/g, "-").replace("project-gutenberg", "gutenberg") || "";
  const map = { "arxiv": "arxiv", "pubmed-central": "pubmed", "pubmed": "pubmed", "doaj": "doaj", "core": "core", "project-gutenberg": "gutenberg", "gutenberg": "gutenberg" };
  return `/img/research/${map[slug] || slug || "arxiv"}.svg`;
};

const PlatformLogo = ({ platform }) => {
  const [err, setErr] = useState(false);
  const src = platform?.logoUrl || getPlatformLogoSrc(platform);
  if (err) return <span className="text-lg font-bold text-gray-500">{platform?.name?.charAt(0) || "?"}</span>;
  return <img src={src} alt="" className="w-full h-full object-contain" onError={() => setErr(true)} />;
};

const ResearchAdminPage = () => {
  const {
    getPlatforms,
    getResources,
    getMostClickedPlatforms,
    getMostSearchedKeywords,
    getMostBookmarkedResources,
    createPlatform,
    createResource,
    deletePlatform,
    deleteResource,
  } = useResearch();
  const { user } = useAuth();

  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [platformForm, setPlatformForm] = useState({
    name: "",
    logoUrl: "",
    baseUrl: "",
    description: "",
    type: "OpenAccess",
    apiAvailable: false,
    isActive: true,
  });
  const [resourceForm, setResourceForm] = useState({
    platformId: "",
    title: "",
    authors: "",
    abstract: "",
    category: "",
    publishedYear: "",
    externalUrl: "",
    tags: "",
    isFeatured: false,
  });

  const orgPlatforms = getPlatforms();
  const orgResources = getResources();
  const mostClickedPlatforms = getMostClickedPlatforms(5);
  const mostSearchedKeywords = getMostSearchedKeywords(10);
  const mostBookmarkedResources = getMostBookmarkedResources(10);

  const handleCreatePlatform = async (e) => {
    e.preventDefault();
    const { response } = await createPlatform(platformForm);
    if (response?.data) {
      setShowPlatformModal(false);
      setPlatformForm({ name: "", logoUrl: "", baseUrl: "", description: "", type: "OpenAccess", apiAvailable: false, isActive: true });
    }
  };

  const handleCreateResource = async (e) => {
    e.preventDefault();
    const { response } = await createResource({
      ...resourceForm,
      authors: resourceForm.authors ? resourceForm.authors.split(",").map((a) => a.trim()).filter(Boolean) : [],
      tags: resourceForm.tags ? resourceForm.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      publishedYear: resourceForm.publishedYear ? parseInt(resourceForm.publishedYear, 10) : null,
    });
    if (response?.data) {
      setShowResourceModal(false);
      setResourceForm({ platformId: "", title: "", authors: "", abstract: "", category: "", publishedYear: "", externalUrl: "", tags: "", isFeatured: false });
    }
  };

  const handleDeletePlatform = async (id) => {
    if (window.confirm("Delete this platform? Resources will be orphaned.")) {
      await deletePlatform(id);
    }
  };

  const handleDeleteResource = async (id) => {
    if (window.confirm("Delete this resource?")) {
      await deleteResource(id);
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
        <h1 className="text-3xl font-bold">Research Hub Admin</h1>
        <p className="text-gray-600 mt-1">Manage platforms, resources, and view analytics.</p>
      </div>

      {/* Analytics */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FiTrendingUp /> Analytics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card customClass="bg-white shadow">
            <h3 className="font-semibold mb-3">Most Clicked Platforms</h3>
            {mostClickedPlatforms.length > 0 ? (
              <ul className="space-y-2">
                {mostClickedPlatforms.map((p) => (
                  <li key={p.id}>{p.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No clicks yet.</p>
            )}
          </Card>
          <Card customClass="bg-white shadow">
            <h3 className="font-semibold mb-3">Most Searched Keywords</h3>
            {mostSearchedKeywords.length > 0 ? (
              <ul className="space-y-2 max-h-32 overflow-y-auto">
                {mostSearchedKeywords.map(({ keyword, count }) => (
                  <li key={keyword} className="text-sm">
                    &quot;{keyword}&quot; ({count})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No searches yet.</p>
            )}
          </Card>
          <Card customClass="bg-white shadow">
            <h3 className="font-semibold mb-3">Most Bookmarked</h3>
            {mostBookmarkedResources.length > 0 ? (
              <ul className="space-y-2 max-h-32 overflow-y-auto">
                {mostBookmarkedResources.map((r) => (
                  <li key={r.id} className="text-sm line-clamp-1">
                    {r.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No bookmarks yet.</p>
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
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <PlatformLogo platform={p} />
                </div>
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-gray-500">{p.type}</div>
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

      {/* Resources */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Resources</h2>
          <button
            onClick={() => setShowResourceModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            <FiPlus /> Add Resource
          </button>
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {orgResources.slice(0, 30).map((r) => (
            <div key={r.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 font-bold text-sm">{r.title?.charAt(0) || "?"}</span>
                </div>
                <div>
                  <div className="font-medium">{r.title}</div>
                  <div className="text-sm text-gray-500">
                    {orgPlatforms.find((p) => p.id === r.platformId)?.name}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDeleteResource(r.id)}
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
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={platformForm.type}
              onChange={(e) => setPlatformForm({ ...platformForm, type: e.target.value })}
            >
              <option value="OpenAccess">OpenAccess</option>
              <option value="PublicDomain">PublicDomain</option>
              <option value="APIIntegrated">APIIntegrated</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={platformForm.apiAvailable}
              onChange={(e) => setPlatformForm({ ...platformForm, apiAvailable: e.target.checked })}
            />
            <label>API Available</label>
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

      {/* Add Resource Modal */}
      <Modal open={showResourceModal} onClose={() => setShowResourceModal(false)} title="Add Resource">
        <form onSubmit={handleCreateResource} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Platform</label>
            <select
              required
              className="w-full border rounded px-3 py-2"
              value={resourceForm.platformId}
              onChange={(e) => setResourceForm({ ...resourceForm, platformId: e.target.value })}
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
              value={resourceForm.title}
              onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">External URL</label>
            <input
              required
              className="w-full border rounded px-3 py-2"
              value={resourceForm.externalUrl}
              onChange={(e) => setResourceForm({ ...resourceForm, externalUrl: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Authors (comma-separated)</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={resourceForm.authors}
              onChange={(e) => setResourceForm({ ...resourceForm, authors: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Abstract</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              value={resourceForm.abstract}
              onChange={(e) => setResourceForm({ ...resourceForm, abstract: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={resourceForm.category}
              onChange={(e) => setResourceForm({ ...resourceForm, category: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Published Year</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={resourceForm.publishedYear}
              onChange={(e) => setResourceForm({ ...resourceForm, publishedYear: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={resourceForm.tags}
              onChange={(e) => setResourceForm({ ...resourceForm, tags: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={resourceForm.isFeatured}
              onChange={(e) => setResourceForm({ ...resourceForm, isFeatured: e.target.checked })}
            />
            <label>Featured</label>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowResourceModal(false)} className="px-4 py-2 border rounded">
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

export default ResearchAdminPage;

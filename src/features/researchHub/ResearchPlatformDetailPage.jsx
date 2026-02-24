import React, { useState } from "react";
import { useParams, Link } from "react-router";
import { useResearch } from "@/context/ResearchContext";
import useAuth from "@/hooks/useAuth";
import ResearchResourceCard from "./ResearchResourceCard";
import RedirectDisclaimerModal from "./RedirectDisclaimerModal";
import { FiArrowLeft, FiSearch, FiFilter } from "react-icons/fi";

const ResearchPlatformDetailPage = () => {
  const { platformId } = useParams();
  const { getPlatformById, getResourcesByPlatform, searchResources, openResourceUrl } = useResearch();
  const { user } = useAuth();
  const platform = getPlatformById(platformId);
  const allResources = getResourcesByPlatform(platformId);

  const [keyword, setKeyword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [pendingOpen, setPendingOpen] = useState(null);
  const [logoError, setLogoError] = useState(false);

  const filteredResources = searchResources({
    keyword,
    category: categoryFilter,
    platformId,
    year: yearFilter,
  });

  const categories = ["", ...new Set(allResources.map((r) => r.category).filter(Boolean))];
  const years = ["", ...new Set(allResources.map((r) => String(r.publishedYear)).filter(Boolean))].sort(
    (a, b) => (b || 0) - (a || 0)
  );

  const handleOpenResource = (resource) => {
    setPendingOpen({ resource, platform });
    setDisclaimerOpen(true);
  };

  const handleConfirmRedirect = () => {
    if (pendingOpen) {
      openResourceUrl(pendingOpen.resource, pendingOpen.platform, user?._id);
      setPendingOpen(null);
    }
  };

  if (!platform) {
    return (
      <div className="p-8">
        <p className="text-gray-600">Platform not found.</p>
        <Link to="/research" className="text-indigo-600 hover:underline mt-2 inline-block">
          Back to Research Hub
        </Link>
      </div>
    );
  }

  const typeBadge = {
    OpenAccess: "bg-green-100 text-green-800",
    PublicDomain: "bg-blue-100 text-blue-800",
    APIIntegrated: "bg-purple-100 text-purple-800",
  };
  const logoMap = { "rp-arxiv": "arxiv", "rp-pubmed": "pubmed", "rp-doaj": "doaj", "rp-core": "core", "rp-gutenberg": "gutenberg" };
  const logoSrc = platform.logoUrl?.startsWith("/") ? platform.logoUrl : `/img/research/${logoMap[platform.id] || "arxiv"}.svg`;

  return (
    <div className="p-4 px-8">
      <Link
        to="/research"
        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6"
      >
        <FiArrowLeft /> Back to Research Hub
      </Link>

      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-white rounded-lg shadow-sm">
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
          {!logoError ? (
            <img src={logoSrc} alt={platform.name} className="w-full h-full object-contain" onError={() => setLogoError(true)} />
          ) : (
            <span className="text-2xl font-bold text-gray-400">{platform.name.charAt(0)}</span>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{platform.name}</h1>
          <p className="text-gray-600 mt-1">{platform.description}</p>
          <div className="flex gap-2 mt-2">
            <span className={`px-2 py-1 rounded text-xs ${typeBadge[platform.type] || "bg-gray-100"}`}>
              {platform.type}
            </span>
            {platform.apiAvailable && (
              <span className="px-2 py-1 rounded text-xs bg-indigo-100 text-indigo-700">API</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
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
              <option value="">All Categories</option>
              {categories.filter(Boolean).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <select
            className="sm:w-32 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="">All Years</option>
            {years.filter(Boolean).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-4">Resources ({filteredResources.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((resource) => (
            <ResearchResourceCard
              key={resource.id}
              resource={resource}
              platform={platform}
              onOpenClick={handleOpenResource}
            />
          ))}
        </div>
        {filteredResources.length === 0 && (
          <p className="text-gray-500 text-center py-8">No resources match your filters.</p>
        )}
      </section>

      <RedirectDisclaimerModal
        open={disclaimerOpen}
        onClose={() => {
          setDisclaimerOpen(false);
          setPendingOpen(null);
        }}
        onConfirm={handleConfirmRedirect}
        destinationName={platform?.name || "external site"}
      />
    </div>
  );
};

export default ResearchPlatformDetailPage;

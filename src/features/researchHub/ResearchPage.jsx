import React, { useContext, useState } from "react";
import { useResearch } from "@/context/ResearchContext";
import useAuth from "@/hooks/useAuth";
import ResearchPlatformCard from "./ResearchPlatformCard";
import ResearchResourceCard from "./ResearchResourceCard";
import RedirectDisclaimerModal from "./RedirectDisclaimerModal";
import { FiSearch, FiFilter, FiStar } from "react-icons/fi";

const ResearchPage = () => {
  const {
    getPlatforms,
    getFeaturedResources,
    getPlatformById,
    searchResources,
    openResourceUrl,
  } = useResearch();
  const { user } = useAuth();
  const platforms = getPlatforms();
  const featuredResources = getFeaturedResources(6);

  const [keyword, setKeyword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [pendingOpen, setPendingOpen] = useState(null);

  const filteredResources = searchResources({
    keyword,
    category: categoryFilter,
    platformId: platformFilter,
    year: yearFilter,
  });

  const allResourcesForFilters = searchResources({});
  const categoriesFromResources = ["", ...new Set(allResourcesForFilters.map((r) => r.category).filter(Boolean))];
  const years = ["", ...new Set(allResourcesForFilters.map((r) => String(r.publishedYear)).filter(Boolean))].sort(
    (a, b) => (b || 0) - (a || 0)
  );

  const handleOpenResource = (resource, platform) => {
    setPendingOpen({ resource, platform });
    setDisclaimerOpen(true);
  };

  const handleConfirmRedirect = () => {
    if (pendingOpen) {
      openResourceUrl(pendingOpen.resource, pendingOpen.platform, user?._id);
      setPendingOpen(null);
    }
  };

  return (
    <div className="p-4 px-8">
      <div className="page-header-subtle mb-8">
        <h1 className="heading-1">Research Hub</h1>
        <p className="text-gray-600 mt-1">
          Discover legal open-access research. Metadata only — no copyrighted content stored.
        </p>
      </div>

      {/* Featured */}
      {featuredResources.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiStar className="text-amber-500" /> Featured Research
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {featuredResources.map((resource) => {
              const platform = getPlatformById(resource.platformId);
              return (
                <ResearchResourceCard
                  key={resource.id}
                  resource={resource}
                  platform={platform}
                  onOpenClick={handleOpenResource}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Search & filters */}
      <section className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by keyword, author, or tag..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div className="relative sm:w-40">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white transition-all duration-200"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categoriesFromResources.filter(Boolean).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <select
            className="sm:w-44 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white transition-all duration-200"
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
          >
            <option value="">All Platforms</option>
            {platforms.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <select
            className="sm:w-32 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white transition-all duration-200"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="">All Years</option>
            {years.filter(Boolean).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Platforms */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Platforms</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {platforms.map((platform) => (
            <ResearchPlatformCard key={platform.id} platform={platform} />
          ))}
        </div>
      </section>

      {/* All resources */}
      <section>
        <h2 className="text-xl font-semibold mb-4">All Resources ({filteredResources.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((resource) => {
            const platform = getPlatformById(resource.platformId);
            return (
              <ResearchResourceCard
                key={resource.id}
                resource={resource}
                platform={platform}
                onOpenClick={handleOpenResource}
              />
            );
          })}
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
        destinationName={pendingOpen?.platform?.name || "external site"}
      />
    </div>
  );
};

export default ResearchPage;

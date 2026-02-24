import React, { useState } from "react";
import { useResearch } from "@/context/ResearchContext";
import useAuth from "@/hooks/useAuth";
import ResearchResourceCard from "./ResearchResourceCard";
import RedirectDisclaimerModal from "./RedirectDisclaimerModal";
import { FiBookmark } from "react-icons/fi";

const MyResearchPage = () => {
  const { getBookmarkedResources, getPlatformById, openResourceUrl } = useResearch();
  const { user } = useAuth();
  const bookmarkedResources = user ? getBookmarkedResources(user._id) : [];

  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [pendingOpen, setPendingOpen] = useState(null);

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

  if (!user) {
    return (
      <div className="p-8">
        <p className="text-gray-600">Please log in to view your research collection.</p>
      </div>
    );
  }

  return (
    <div className="p-4 px-8">
      <div className="mb-8 shadow-sm p-6 bg-white rounded-lg">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <FiBookmark className="text-amber-500" /> My Research
        </h1>
        <p className="text-gray-600 mt-1">
          Your saved research resources. Quick access to bookmarked open-access papers and articles.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookmarkedResources.map((resource) => {
          const platform = getPlatformById(resource.platformId);
          return (
            <ResearchResourceCard
              key={resource.id}
              resource={resource}
              platform={platform}
              onOpenClick={handleOpenResource}
              showBookmark={true}
            />
          );
        })}
      </div>

      {bookmarkedResources.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <FiBookmark className="mx-auto text-4xl text-gray-300 mb-4" />
          <p className="text-gray-600">No bookmarked research yet.</p>
          <p className="text-sm text-gray-500 mt-1">
            Browse the Research Hub and click the bookmark icon to save resources.
          </p>
        </div>
      )}

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

export default MyResearchPage;

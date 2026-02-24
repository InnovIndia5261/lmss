import React, { useContext } from "react";
import Card from "@/components/common/Card";
import { FiExternalLink, FiBookmark, FiCopy } from "react-icons/fi";
import { useResearch } from "@/context/ResearchContext";
import useAuth from "@/hooks/useAuth";
import { getCitation } from "@/services/research";
import { NotificationContext } from "@/components/common/Notification";

const ResearchResourceCard = ({
  resource,
  platform,
  onOpenClick,
  showBookmark = true,
  showCitation = true,
}) => {
  const { isBookmarked, bookmarkResource, removeBookmark } = useResearch();
  const { user } = useAuth();
  const { toast } = useContext(NotificationContext);
  const bookmarked = user && isBookmarked(user._id, resource.id);

  const handleCopyCitation = (format) => {
    const citation =
      format === "APA"
        ? (resource.citationFormatAPA || getCitation({ ...resource, platformName: platform?.name }, "APA"))
        : (resource.citationFormatMLA || getCitation({ ...resource, platformName: platform?.name }, "MLA"));
    navigator.clipboard?.writeText(citation).then(() => {
      toast?.("Citation copied to clipboard");
    });
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    if (bookmarked) removeBookmark(user._id, resource.id);
    else bookmarkResource(user._id, resource.id);
  };

  return (
    <Card customClass="h-full flex flex-col">
      <div className="flex flex-col h-full">
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-gray-900 line-clamp-2 flex-1">{resource.title}</h3>
            {resource.isFeatured && (
              <span className="badge-featured flex-shrink-0">Open Access</span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {(resource.authors || []).join(", ")} • {resource.publishedYear}
          </p>
          <div className="section-divider" />
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{resource.abstract}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            <span className="px-2 py-0.5 rounded text-xs bg-gray-100">{resource.category}</span>
            {(resource.tags || []).slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs text-gray-500">#{tag}</span>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 flex flex-wrap gap-2">
          <button
            onClick={() => onOpenClick(resource, platform)}
            className="btn-primary flex items-center gap-2 font-medium text-sm"
          >
            <FiExternalLink size={16} /> Open
          </button>
          {showBookmark && user && (
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-lg border transition-colors duration-150 ${
                bookmarked ? "bg-amber-50 border-amber-200 text-amber-700" : "border-gray-200 hover:bg-gray-50"
              }`}
              title={bookmarked ? "Remove bookmark" : "Bookmark"}
            >
              <FiBookmark size={18} fill={bookmarked ? "currentColor" : "none"} />
            </button>
          )}
          {showCitation && (
            <div className="flex gap-1">
              <button
                onClick={() => handleCopyCitation("APA")}
                className="px-2 py-1 text-xs border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-150"
                title="Copy APA">
                APA
              </button>
              <button
                onClick={() => handleCopyCitation("MLA")}
                className="px-2 py-1 text-xs border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-150"
                title="Copy MLA">
                MLA
              </button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ResearchResourceCard;

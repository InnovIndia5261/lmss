import React, { useState } from "react";
import { Link } from "react-router";
import Card from "@/components/common/Card";
import { FiExternalLink } from "react-icons/fi";

const typeBadge = {
  OpenAccess: "bg-green-100 text-green-800",
  PublicDomain: "bg-blue-100 text-blue-800",
  APIIntegrated: "bg-purple-100 text-purple-800",
};

const getLogoSrc = (platform) => {
  if (platform?.logoUrl?.startsWith("/")) return platform.logoUrl;
  const map = { "rp-arxiv": "arxiv", "rp-pubmed": "pubmed", "rp-doaj": "doaj", "rp-core": "core", "rp-gutenberg": "gutenberg" };
  return `/img/research/${map[platform?.id] || "arxiv"}.svg`;
};

const ResearchPlatformCard = ({ platform }) => {
  const [imgError, setImgError] = useState(false);
  const badgeClass = typeBadge[platform.type] || "bg-gray-100 text-gray-800";
  const logoSrc = platform?.logoUrl || getLogoSrc(platform);

  return (
    <Link to={`/research/${platform.id}`}>
      <Card customClass="bg-white shadow hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="flex flex-col items-center text-center p-6">
          <div className="w-20 h-20 mb-4 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            {!imgError ? (
              <img
                src={logoSrc}
                alt={platform.name}
                className="w-full h-full object-contain"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="text-2xl font-bold text-gray-400">{platform.name.charAt(0)}</span>
            )}
          </div>
          <h3 className="font-bold text-lg text-gray-900">{platform.name}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{platform.description}</p>
          <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${badgeClass}`}>
            {platform.type}
          </span>
          {platform.apiAvailable && (
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs bg-indigo-50 text-indigo-700">
              API
            </span>
          )}
          <div className="mt-4 flex items-center gap-1 text-indigo-600 text-sm font-medium">
            <FiExternalLink size={14} /> Browse resources
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ResearchPlatformCard;

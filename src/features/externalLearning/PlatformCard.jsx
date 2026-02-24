import React, { useState } from "react";
import { Link } from "react-router";
import Card from "@/components/common/Card";
import { FiExternalLink } from "react-icons/fi";

const PlatformCard = ({ platform }) => {
  const [imgError, setImgError] = useState(false);
  const logoSrc = platform.logoUrl || `/img/platforms/${platform.name.toLowerCase().replace(/\s+/g, "-")}.svg`;
  return (
    <Link to={`/external-learning/${platform.id}`}>
      <Card customClass="h-full flex flex-col">
        <div className="flex flex-col items-center text-center p-6">
          <div className="w-16 h-16 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
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
          <span className="badge-featured inline-block mt-2">
            {platform.category}
          </span>
          <div className="mt-4 flex items-center gap-1 text-indigo-600 text-sm font-medium">
            <FiExternalLink size={14} /> Browse courses
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default PlatformCard;

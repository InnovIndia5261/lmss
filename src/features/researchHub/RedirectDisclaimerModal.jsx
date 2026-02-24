import React from "react";
import Modal from "@/components/common/modal";
import { FiExternalLink, FiAlertTriangle } from "react-icons/fi";

/**
 * External redirect disclaimer modal.
 * Required before opening third-party open-access websites.
 * Supports DMCA safe harbor and enterprise compliance.
 */
const RedirectDisclaimerModal = ({ open, onClose, onConfirm, destinationName = "external website" }) => {
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="External Link Disclaimer">
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-5 bg-amber-50 border border-amber-200 rounded-2xl">
          <FiAlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={24} />
          <div>
            <p className="font-medium text-amber-900">You are leaving this platform</p>
            <p className="text-sm text-amber-800 mt-1">
              You are about to visit a third-party open-access website ({destinationName}). This platform does not control
              external content. We store only metadata (title, abstract, link) and do not scrape or store copyrighted
              content.
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          By continuing, you acknowledge that you are accessing a legal public-access resource and agree to comply with
          the destination site&apos;s terms of use.
        </p>
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="btn-primary flex items-center gap-2"
          >
            <FiExternalLink size={16} /> Continue to {destinationName}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RedirectDisclaimerModal;

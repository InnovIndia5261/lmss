import React from "react";
import { FiX } from "react-icons/fi";

const Modal = ({ children, open, onClose, title = "" }) => {
  return (
    <>
      {open && (
        <div className="modal-backdrop">
          <div className="modal-content m-auto w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-200/60 overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200/80 bg-gray-50/80">
              <h4 className="heading-2">{title || "Modal"}</h4>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200/80 rounded-xl cursor-pointer transition-all duration-200"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="px-6 py-6">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;

import React from "react";

const Card = ({ children, customClass, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`py-6 px-6 bg-white rounded-2xl border border-gray-200/60 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ease-out ${customClass} ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      {children}
    </div>
  );
};

export default Card;

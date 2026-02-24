import React from "react";

const Loader = ({ fullscreen = true }) => {
  return (
    <div
      className={`${
        fullscreen ? "h-[100vh]" : ""
      } flex justify-center items-center gap-2`}
    >
      <div
        style={{ animationDelay: "0ms" }}
        className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"
      />
      <div
        style={{ animationDelay: "150ms" }}
        className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"
      />
      <div
        style={{ animationDelay: "300ms" }}
        className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"
      />
    </div>
  );
};

export default Loader;

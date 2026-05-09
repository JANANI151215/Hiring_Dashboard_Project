import React from "react";

export const Button = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`px-3 py-2 rounded-lg font-medium border transition-all duration-200 ${className}`}
  >
    {children}
  </button>
);

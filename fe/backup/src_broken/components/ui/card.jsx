import React from "react";

export const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow ${className}`}>{children}</div>
);

export const CardHeader = ({ children, className = "" }) => (
  <div className={`border-b p-4 ${className}`}>{children}</div>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = "" }) => (
  <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>
);

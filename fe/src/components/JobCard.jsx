import React from "react";

export default function Card({ title, children }) {
  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm">
      {title && <h4 className="font-semibold mb-3">{title}</h4>}
      {children}
    </div>
  );
}

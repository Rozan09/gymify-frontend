import React from "react";

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-[9999]">
      <i className="fa-solid fa-dumbbell fa-spin fa-3x" style={{ color: '#f25454' }}></i>
    </div>
  );
}
import React from "react";

export default function Dog({ url, children }) {
  return (
    <div className="relative rounded-lg overflow-hidden break-inside-avoid shadow-md">
      <img
        className="w-full hover:scale-105 transition-transform"
        src={url}
        alt="a dog"
      />
      <div className="border border-gray-200 py-4 px-4">{children}</div>
    </div>
  );
}

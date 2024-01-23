import React from "react";

export default function Dog({ url, children }) {
  return (
    <div className="relative break-inside-avoid rounded-lg shadow-md">
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          className="w-full hover:scale-105 transition-transform"
          src={url}
          alt="a dog"
        />
      </div>
      {children}
    </div>
  );
}

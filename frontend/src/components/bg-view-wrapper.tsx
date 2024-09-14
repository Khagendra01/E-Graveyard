import React from "react";

export default function BgViewWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-screen">
      <div className="absolute inset-0 bg-hero bg-no-repeat bg-cover"></div>
      <div className="absolute inset-0 bg-black opacity-70"></div>
      {children}
    </div>
  );
}

"use client";

export default function PixelBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <img
        src="/bg.png"
        alt=""
        className="h-full w-full object-cover"
        data-pixel=""
      />
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
}

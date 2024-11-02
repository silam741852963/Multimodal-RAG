import Link from "next/link";

export default function Logo({ scale = 1 }) {
  // Base dimensions
  const baseWidth = 400; // Adjust as needed
  const baseHeight = 100; // Adjust as needed

  // Scaled dimensions
  const width = baseWidth * scale;
  const height = baseHeight * scale;

  return (
    <Link
      href="/"
      className="relative block"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      }}
    >
      <span className="font-sans italic font-light text-2xl -rotate-90 absolute top-6 tracking-[0.5em]">
        All
      </span>
      <span className="font-beauty-demo text-8xl absolute left-12 tracking-[0.2em]">
        B
      </span>
      <span className="font-beauty-demo text-7xl absolute top-6 left-32 tracking-[0.2em]">
        eauty
      </span>
    </Link>
  );
}

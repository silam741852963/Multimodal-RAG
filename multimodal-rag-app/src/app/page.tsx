import Image from "next/image";

export default function Home() {
  return (
    <Image
      src="https://m.media-amazon.com/images/I/31TgqAZ8kQL.jpg"
      alt="Next.js logo"
      width={180}
      height={38}
      priority
    />
  );
}

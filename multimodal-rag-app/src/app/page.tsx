import Image from "next/image";
import Nav from "./components/Nav";
import { Hero } from "./components/Hero";

export default function Home() {
  return (
    <main className="h-dvh w-full flex">
      <Image
        src="/img/bg.jpg"
        alt="Home page background - All beauty product"
        width={500}
        height={1200}
        quality={100}
        className="m-10 rounded-lg"
      />
      <section className="m-10 w-full flex flex-col gap-48">
        <Nav />
        <Hero />
      </section>
    </main>
  );
}

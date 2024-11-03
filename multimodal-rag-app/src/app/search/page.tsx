import Nav from "../components/Nav";
import SearchResults from "../components/SearchResult";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search | All Beauty",
  description: "Search all beauty products on Amazon by image",
};

export default function Page() {
  return (
    <main>
      <section className="m-10 flex flex-col gap-28">
        <Nav />
        <SearchResults />
      </section>
    </main>
  );
}

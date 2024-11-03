"use client";
import React from "react";
import Image from "next/image";
import { useSearchContext } from "@/components/context/SearchContext";
import SearchResultItem from "./SearchResultItem";
import { ArrowRight } from "lucide-react";

const SearchResults: React.FC = () => {
  const { searchData, response } = useSearchContext();

  console.log(response);

  if (!response || response.data.length === 0) {
    return <p className="mx-auto">No results to display.</p>;
  }

  return (
    <div className="flex w-full items-center justify-center">
      <ArrowRight />
      <ul className="flex flex-wrap gap-10 justify-center">
        <li className="flex items-center w-[35rem] justify-center">
          {searchData.image && (
            <Image
              src={URL.createObjectURL(searchData.image)}
              alt="Uploaded Image"
              width={300}
              height={300}
              objectFit="cover"
              className="rounded-md"
            />
          )}
        </li>
        {/* Render each search result item */}
        {response.data.map((item, index) => (
          <li key={index}>
            <SearchResultItem item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;

"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
};

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchData, setSearchData] = useState<SearchData>({
    query: "",
    image: undefined,
    limit: 10,
  });
  const [response, setResponse] = useState<SearchResponse | null>(null);

  return (
    <SearchContext.Provider
      value={{ searchData, setSearchData, response, setResponse }}
    >
      {children}
    </SearchContext.Provider>
  );
};

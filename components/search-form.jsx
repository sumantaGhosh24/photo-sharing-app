"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {Search, X} from "lucide-react";

const SearchForm = () => {
  const [search, setSearch] = useState("");

  const router = useRouter();

  const handleSubmit = () => {
    const searchData = search.toLowerCase().trim().replaceAll(/\s+/g, " ");
    router.push(`/search/${searchData}`);
  };

  return (
    <form
      className="flex gap-1 rounded-lg bg-gray-200 px-4 py-2 dark:bg-background"
      action={handleSubmit}
    >
      <Search className="mt-2.5 text-muted-foreground" />
      <input
        id="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={`Search query then press enter`}
        className="flex h-10 w-full rounded-md bg-gray-200 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none dark:bg-background"
      />
      {search && (
        <X
          className="mt-2.5 cursor-pointer text-muted-foreground"
          onClick={() => setSearch("")}
        />
      )}
    </form>
  );
};

export default SearchForm;

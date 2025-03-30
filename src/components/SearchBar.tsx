
import React, { useState } from "react";
import { Search, X } from "lucide-react";

type SearchBarProps = {
  onSearch: (query: string) => void;
  placeholder?: string;
};

const SearchBar = ({ onSearch, placeholder = "Search..." }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-lg">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-muted-foreground" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input-search pl-10 pr-10"
          placeholder={placeholder}
          aria-label="Search"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            aria-label="Clear search"
          >
            <X size={18} className="text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;

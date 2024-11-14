import React from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

const SearchInput = () => {
  return (
    <div className="relative w-full">
      <Input placeholder="Buscar" className="bg-[#F0F2F5] pl-10 w-full" />

      <div className="absolute top-2 left-2">
        <Search />
      </div>
    </div>
  );
};

export default SearchInput;

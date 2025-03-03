import React from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

// Definir la interfaz de las propiedades
interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-full">
      <Input
        value={value}
        onChange={onChange}
        placeholder="Buscar"
        className="pl-10 w-full bg-[#F0F2F5]"
      />
      <div className="absolute top-2 left-2">
        <Search />
      </div>
    </div>
  );
};

export default SearchInput;



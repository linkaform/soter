import React, { useState, useMemo } from "react";
import debounce from "lodash.debounce";

interface SearchPasesProps {
    onSearch: (value: string) => void;
}

const SearchPases: React.FC<SearchPasesProps> = ({ onSearch }) => {
    const [search, setSearch] = useState("");

    const debouncedOnSearch = useMemo(
        () => debounce(onSearch, 400),
        [onSearch]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        debouncedOnSearch(e.target.value);
    };

    return (
        <input
            type="text"
            placeholder="Buscar pase..."
            value={search}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2 w-full max-w-xs"
        />
    );
};

export default SearchPases;
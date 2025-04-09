import React from "react";
import { Input } from "@/components/ui/input";
import { FaSearch } from "react-icons/fa";

const Searchbar = () => {
  return (
    <div className="relative my-1 flex h-fit items-center pr-5">
      <FaSearch className="text-primary-400 absolute ml-2 opacity-80" />
      <Input
        type="text"
        placeholder="Search"
        className="placeholder-primary-400 relative w-full rounded-md px-1 py-2.5 indent-7.5"
      />
    </div>
  );
};

export default Searchbar;

/* eslint-disable react-hooks/exhaustive-deps */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import SearchInput from "../search-input";
import { useShiftStore } from "@/store/useShiftStore";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import { esHexadecimal } from "@/lib/utils";
import { toast } from "sonner";
import { useAccessStore } from "@/store/useAccessStore";
import { usePasses } from "@/hooks/usePasses";

interface ActivePassesModalProps {
  title: string;
  children: React.ReactNode;
//   setPass: Dispatch<SetStateAction<string>>;
//   pass:string;
  setOpen:Dispatch<SetStateAction<boolean>>;
  open:boolean;
  input: string;
  setInput:Dispatch<SetStateAction<string>>;
}

export const ActivePassesModal: React.FC<ActivePassesModalProps> = ({
  title,
  children, open, setOpen, input, setInput 
}) => {
  const { location } = useShiftStore();
  const { setPassCode , passCode} = useAccessStore();
  const [searchText, setSearchText] = useState("");
  const { data: activePasses, isLoading } = usePasses(location);

  useEffect(() => {
    if (open) {
      setSearchText(input);
    } else {
      const timeout = setTimeout(() => {
        setSearchText("");
        setInput("");
      }, 300); 
      return () => clearTimeout(timeout);
    }
  }, [open, input]);

  const filteredTemporaryPasses = (search:string) => {
    return  (activePasses?.filter((item: any) =>
      item.nombre?.toLowerCase().includes(search.toLowerCase()) ))
  }

  const handleSelectPass = (item: any) => {
    if (esHexadecimal(item._id) && item._id !== passCode) {
      	setPassCode(item._id); 
        setSearchText("")
        setInput("")
        setOpen(false); 
    }else{
		toast.error("Escoge un pase diferente...")
	}
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {children}
      </DialogTrigger>

      <DialogContent className="max-w-xl flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center font-bold my-5">
            {title}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="w-16 h-16 border-8 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <SearchInput
              value={searchText}
              onChange={(e) =>{setSearchText(e.target.value);}}
            />
            <div className="flex-1 overflow-y-auto max-h-[500px] space-y-0 border-t border-b mt-2">
            {filteredTemporaryPasses(searchText)?.length === 0 ? (
				<div className="text-center text-lg text-gray-500 py-10">
					No hay resultados disponibles
				</div>
            ) : (
              filteredTemporaryPasses(searchText)?.map((item: any) => {
                const avatarUrl = item?.foto?.[0]?.file_url || "/nouser.svg";

                return (
                  <div
                    key={item._id}
                    className="flex items-center justify-between px-4 py-4 border-b hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => handleSelectPass(item)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden">
                        <Image
                          src={avatarUrl}
                          alt={item.nombre || "Sin nombre"}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold">{item.nombre}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
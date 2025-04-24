import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import SearchInput from "../search-input";
import { useQuery } from "@tanstack/react-query";
import { useShiftStore } from "@/store/useShiftStore";
import { fetchPasesActivos } from "@/lib/access";
import { useState } from "react";
import Image from "next/image";
import { esHexadecimal } from "@/lib/utils";
import { useAccessStore } from "@/store/useAccessStore";
// import { useAccessStore } from "@/store/useAccessStore";

interface ActivePassesModalProps {
  title: string;
  children: React.ReactNode;
}



export const ActivePassesModal: React.FC<ActivePassesModalProps> = ({
  title,
  children,
}) => {
  const { setPassCode } = useAccessStore();
console.log("dentro de lista de activos")
  const { area, location } = useShiftStore();

  const [searchText, setSearchText] = useState("");

  const [open, setOpen] = useState(false); 

  const { data: activePasses, isLoading } = useQuery<any>({
    queryKey: ["getActivePasses", area, location],
    enabled: open,
    queryFn: async () => { 
      const data = await fetchPasesActivos({ area, location });
      return Array.isArray(data.response?.data)? data?.response?.data : [];
    },
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const filteredTemporaryPasses = activePasses?.filter((item: any) =>
    item.nombre?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Dialog>
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
              onChange={(e) => setSearchText(e.target.value)}
            />
            <div className="flex-1 overflow-y-auto max-h-[500px] space-y-0 border-t border-b mt-2">
              {filteredTemporaryPasses?.map((item: any) => {
                const avatarUrl = item?.foto?.[0]?.file_url || "/nouser.svg";


                return (
                  <div
                    key={item._id}
                    className="flex  items-center justify-between px-4 py-4 border-b hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => {
							        console.log("valor", item._id)
                      if(esHexadecimal(item._id)){
                        setPassCode(item._id)
                      }
                    }}
                  >
                    <div className="flex items-center space-x-4 ">
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
              })}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
import { Flag, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useHandleBooth } from "@/hooks/useHandleBooth";
import { useState, useMemo } from "react";

interface ChangeBoothProps {
  title: string;
  children: React.ReactNode;
}

export const ChangeBoothModal: React.FC<ChangeBoothProps> = ({
  title,
  children,
}) => {
  const [open, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { booths, changeBoothMutation, isLoading } = useHandleBooth(open);

  const filteredBooths = useMemo(() => {
    if (!booths) return [];
    
    if (!searchTerm.trim()) return booths;

    const search = searchTerm.toLowerCase();
    return booths.filter(
      (item) =>
        item?.area?.toLowerCase().includes(search) ||
        item?.location?.toLowerCase().includes(search)
    );
  }, [booths, searchTerm]);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    if (!newOpen) {
      setSearchTerm("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center font-bold my-2">
            {title}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="w-16 h-16 border-8 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por área o ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex-1 overflow-y-auto max-h-[500px] space-y-0 mt-2">
              {filteredBooths.length > 0 ? (
                filteredBooths.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() =>
                      changeBoothMutation.mutate({
                        area: item?.area,
                        location: item?.location,
                        })
                      }
                    
                  >
                    <div className="mr-4 bg-gray-100 p-4 rounded-lg">
                      <Flag />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-base">{item?.area}</p>
                      <p className="text-sm text-gray-600">{item?.location}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <Search className="w-12 h-12 mb-2 text-gray-300" />
                  <p className="text-sm">No se encontraron resultados.</p>
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
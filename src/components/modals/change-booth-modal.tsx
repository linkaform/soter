/* eslint-disable @typescript-eslint/no-explicit-any */
import { Flag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { useHandleBooth } from "@/hooks/useHandleBooth";

interface ChangeBoothProps {
  title: string;
  children: React.ReactNode;
}

export const ChangeBoothModal: React.FC<ChangeBoothProps> = ({
  title,
  children,
}) => {
  const { booths, changeBoothMutation, isLoading } = useHandleBooth();

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl	 text-center  font-bold my-2">
            {title}
          </DialogTitle>
          <Separator />
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="w-16 h-16 border-8 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto max-h-[500px] space-y-0 mt-2">
              {booths?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2  hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() =>
                    changeBoothMutation.mutate({
                      area: item?.area,
                      location: item?.address_name,
                    })
                  }
                >
                  <div className="mr-4 bg-gray-100 p-4 rounded-lg">
                    <Flag />
                  </div>

                  <div className="flex-1 space-y-1">
                    <p className="text-base">{item?.area}</p>
                    <p className="text-sm">{item?.address_name}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

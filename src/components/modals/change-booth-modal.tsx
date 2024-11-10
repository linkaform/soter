import { Flag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";

interface ChangeBoothProps {
  title: string;
  children: React.ReactNode;
}

export const ChangeBoothModal: React.FC<ChangeBoothProps> = ({
  title,
  children,
}) => {
  const items = [
    {
      icon: <Flag />,
      title: "Planta Monterrey",
      subtitle: "Caseta 6 Poniente",
    },
    { icon: <Flag />, title: "Planta Monterrey", subtitle: "Caseta 1 Norte" },
    {
      icon: <Flag />,
      title: "Planta Monterrey",
      subtitle: "Caseta Av Independencia",
    },
    {
      icon: <Flag />,
      title: "Planta Monterrey",
      subtitle: "Caseta Calle Arcos",
    },
    {
      icon: <Flag />,
      title: "Planta Durango",
      subtitle: "Caseta Calle Zapata",
    },
    { icon: <Flag />, title: "Planta Durango", subtitle: "Caseta Reforma" },
    { icon: <Flag />, title: "Planta Durango", subtitle: "Caseta 6 Sur" },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl	 text-center  font-bold my-5">
            {title}
          </DialogTitle>
          <Separator />
        </DialogHeader>

        <div className="">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 rounded-md p-4"
            >
              <div className="mr-4 bg-gray-100 p-4 rounded-lg">{item.icon}</div>

              <div className="flex-1 space-y-1">
                <p className="text-base">{item.title}</p>
                <p className="text-sm">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

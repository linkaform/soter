import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // ajusta la ruta si tu carousel está en otro lugar
import { Card, CardContent } from "@/components/ui/card";

const GrupoCarousel = ({ titulo = "Miembros del grupo" }: {titulo:string}) => {
    const data = [
          {
            name: "Juan Pérez",
            file_url: "/nouser.svg",
            file_name: "juan_perez.jpg",
          },
          {
            name: "María López",
            file_url: "/nouser.svg",
            file_name: "maria_lopez.jpg",
          },
          {
            name: "Carlos Ruiz",
            file_url: "/nouser.svg",
            file_name: "carlos_ruiz.jpg",
          },
          {
            name: "Ana Gómez",
            file_url: "/nouser.svg",
            file_name: "ana_gomez.jpg",
          },
          {
            name: "Luis Fernández",
            file_url: "/nouser.svg",
            file_name: "luis_fernandez.jpg",
          },
        ];
  return (
    <div className="flex flex-col justify-center w-full py-3">
      <h2 className="text-2xl font-bold mb-4 text-center">{titulo}</h2>
      <div className="flex justify-center">
        <Carousel className="w-2/4">
          <CarouselContent className="flex gap-4">
            {data.map((a:any, index:number) => (
              <CarouselItem key={index} className="basis-1/3"> {/* ← 3 items por slide */}
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-2">
                    <Image
                      width={150}
                      height={150}
                      src={a.file_url || "/nouser.svg"}
                      alt={`Miembro ${index + 1}`}
                      className="object-contain bg-gray-200 rounded-lg"
                    />
                  </CardContent>
                </Card>
                <div className="">{a.name}</div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default GrupoCarousel;
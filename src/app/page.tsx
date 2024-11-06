import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";

export default function Home() {




  return (
    <div className="">
      <Header />

      <div className="flex m-8 justify-end">
        <Button className="w-[300px] bg-button-primary hover:bg-bg-button-primary">
          Iniciar turno
        </Button>
      </div>
    </div>
  );
}

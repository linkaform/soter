import { useState } from 'react';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import { Card, CardContent } from '../ui/card';
import { Imagen } from '@/lib/update-pass-full';

const ViewImage = ({ imageUrl }: { imageUrl: Imagen[] }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Avatar
          onClick={() => setOpen(true)}
          style={{ cursor: 'pointer' }}
        >
          <AvatarImage
            src={imageUrl[0]?.file_url ?? "/nouser.svg"}
            alt="Avatar"
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        </Avatar>
      </DialogTrigger>
      <DialogContent className="p-0 max-w-xl">
      <DialogTitle></DialogTitle>
      {imageUrl.length<=1 ? (
        <Image
            width={150}
            height={150}
            className='p-12 w-full h-full object-cover'
            src={imageUrl[0]?.file_url ?? "/nouser.svg"}
            alt="Imagen grande"
        />
      ):(
        <div className="flex justify-center">
            <Carousel className="w-full">
                <CarouselContent>
                    {imageUrl.map((a, index) => (
                    <CarouselItem key={index}>
                        <div className="p-1">
                        <Card>
                            <CardContent className="flex aspect-square items-center justify-center p-0">
                            {/* <span className="text-4xl font-semibold"> */}
                                <Image
                                    width={150}
                                    height={150}
                                    src= {a?.file_url ?? "/nouser.svg"}
                                    alt="Imagen"
                                    className="w-full h-full p-12 object-contain rounded-lg" 
                                />
                            {/* </span> */}
                            </CardContent>
                        </Card>
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
      )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewImage;
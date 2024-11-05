"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useRouter } from 'next/navigation';


export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();



  const handleLogin = () => {
  
      router.push('/');
  
  };

  return (
    <Suspense>
      <div className="flex flex-col h-screen items-center justify-center">
       
       
        <Card className="">
          <CardContent className="flex w-[500px] h-[600px] flex-col justify-center items-center">
            <Image
              className="mb-10 flex mx-auto"
              src="/logo.svg"
              alt="soter logo"
              width={174}
              height={58}
              priority
            />

            <Input
              className="mb-5 placeholder:text-[#3D4D5C] bg-[#F0F2F5] h-[56px] rounded-lg"
              type="email"
              placeholder="Email"
            />

            <div
              className="w-full relative"
              onClick={() => setShowPassword(!showPassword)}
            >
              <Input
                className="w-full mb-5 placeholder:text-[#3D4D5C] bg-[#F0F2F5] h-[56px] rounded-lg"
                type={showPassword ? "password" : "text"}
                placeholder="Password"
              />

              <div className="absolute right-3 top-4"  onClick={() => setShowPassword(!showPassword)}>
                {showPassword && <Eye className="text-gray-light" />}
                {!showPassword && <EyeOff className="text-gray-light" />}
              </div>
            </div>

            <div className="flex justify-start w-full">
              <Button variant="link" className="mb-5">
                ¿Olvidó su contraseña?
              </Button>
            </div>

            <Button className="flex w-3/4 mx-auto bg-button-primary hover:bg-bg-button-primary" onClick={() => handleLogin()}>
              Login
            </Button>
          </CardContent>
        </Card>

      
      </div>
    </Suspense>
  );
}

"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";


export const HeaderPase = () => {
  return (
    <header className="w-full shadow py-3 px-12">
      <div className="mx-auto flex flex-col lg:flex-row items-center justify-between">
          <div className="flex  mb-5 lg:mb-0 justify-center items-center">
            <Link href="/">
              <Image
                className="dark:invert"
                src="/logo.svg"
                alt="Next.js logo"
                width={150}
                height={50}
                priority
              />
            </Link>
          </div>
      </div>
    </header>
  );
};

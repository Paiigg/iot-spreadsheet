"use client";

import React from "react";
import { ModeToggle } from "./theme-toggle";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { usePathname } from "next/navigation";

import Image from "next/image";
import Logo from "@/public/logo.png";
import LogoIAT from "@/public/logo_iat.svg";
import Link from "next/link";

import { FolderKanban, ShieldAlert, AlignLeft, Slash, X } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <>
      <div
        className={`${
          pathname === "/sign-in" ||
          pathname === "/sign-in/factor-one" ||
          pathname === "/sign-up"
            ? "hidden"
            : "lg:block hidden"
        } h-screen p-4 border-r  w-[300px] sticky top-0 left-0 `}
      >
        <Command>
          {/* <Link href="/">
            <div className="flex items-center justify-center mb-2">
              <Image
                src={Logo}
                width={100}
                height={100}
                alt="Logo PT Indospring Tbk."
              />

              <X size={50} color="hsl(var(--primary))" className="pr-4" />
              <Image
                src={LogoIAT}
                width={100}
                height={100}
                alt="Logo IAT PT Indospring Tbk."
              />
            </div>
          </Link> */}

          <div className="flex flex-col items-center justify-center">
            <Link href="/">
              <div className="flex items-center justify-center mb-2">
                <Image
                  src={Logo}
                  width={100}
                  height={100}
                  alt="Logo PT Indospring Tbk."
                />

                <X size={50} color="hsl(var(--primary))" className="pr-4" />
                <Image
                  src={LogoIAT}
                  width={100}
                  height={100}
                  alt="Logo IAT PT Indospring Tbk."
                />
              </div>
            </Link>
            <ModeToggle />
          </div>
          <CommandList className="flex flex-col justify-between">
            <CommandGroup heading="General">
              <div>
                <Link href="/">
                  <CommandItem
                    className={`${
                      pathname === "/"
                        ? "font-semibold gap-2  bg-primary text-white"
                        : "font-normal gap-2"
                    }`}
                  >
                    <FolderKanban />
                    Dashboard
                  </CommandItem>
                </Link>
                <Link href="/warning">
                  <CommandItem
                    className={`${
                      pathname === "/warning"
                        ? "font-semibold gap-2 bg-primary text-white"
                        : "font-normal gap-2"
                    }`}
                  >
                    <ShieldAlert />
                    Warning Log
                  </CommandItem>
                </Link>
              </div>
            </CommandGroup>
            <CommandGroup heading="User">
              <CommandItem>
                <UserButton
                  afterSignOutUrl="/sign-in"
                  showName
                  appearance={{
                    elements: {
                      userButtonBox: {
                        flexDirection: "row-reverse",
                        fontWeight: 900,
                        color: "hsl(var(--primary))",
                      },
                    },
                  }}
                />
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
      <div
        className={`${
          pathname === "/sign-in" ||
          pathname === "/sign-in/factor-one" ||
          pathname === "/sign-up"
            ? "hidden"
            : "block lg:hidden"
        } sticky top-0 w-full overflow-x-hidden shadow-md lg:hidden backdrop-filter backdrop-blur-lg`}
      >
        <div className="flex items-center justify-between p-4">
          <div>
            <Drawer direction="left">
              <DrawerTrigger>
                <AlignLeft />
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <Command>
                    <div className="flex flex-col items-center justify-center">
                      <Link href="/">
                        <div className="flex items-center justify-center">
                          <Image
                            src={Logo}
                            width={70}
                            height={0}
                            alt="Logo PT Indospring Tbk."
                          />

                          <X
                            size={50}
                            color="hsl(var(--primary))"
                            className="pr-4"
                          />
                          <Image
                            src={LogoIAT}
                            width={70}
                            height={70}
                            alt="Logo IAT PT Indospring Tbk."
                          />
                        </div>
                      </Link>
                      <ModeToggle />
                    </div>
                    <CommandList>
                      <CommandGroup heading="General">
                        <div>
                          <Link href="/">
                            <CommandItem
                              className={`${
                                pathname === "/"
                                  ? "font-semibold gap-2 py-4  bg-primary text-white "
                                  : "font-normal gap-4 py-4"
                              }`}
                            >
                              <FolderKanban />
                              Dashboard
                            </CommandItem>
                          </Link>
                          <Link href="/warning">
                            <CommandItem
                              className={`${
                                pathname === "/warning"
                                  ? "font-semibold gap-2 bg-primary text-white py-4"
                                  : "font-normal gap-2 py-4"
                              }`}
                            >
                              <ShieldAlert />
                              Warning Log
                            </CommandItem>
                          </Link>
                        </div>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </DrawerHeader>
              </DrawerContent>
            </Drawer>
          </div>

          <UserButton
            showName
            appearance={{
              elements: {
                userButtonBox: {
                  color: "hsl(var(--primary))",
                },
              },
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Sidebar;

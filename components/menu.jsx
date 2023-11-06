"use client";

import {signOut} from "next-auth/react";
import Link from "next/link";
import {useState} from "react";
import {Menu, X} from "lucide-react";

import {ModeToggle} from "./mode-toggle";
import {Button} from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";

const Menubar = ({user}) => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-black dark:text-white w-full border-b md:border-0 shadow-lg dark:shadow-gray-200">
      <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8">
        <div className="flex items-center justify-between py-3 md:py-5 md:block">
          <Link href="/">
            <h1 className="text-3xl font-bold text-black dark:text-white">
              Logo
            </h1>
          </Link>
          <div className="md:hidden">
            <button
              className="text-gray-700 outline-none p-2 rounded-md focus:border-gray-400 focus:border"
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        <div
          className={`flex-1 justify-end pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
            open ? "block" : "hidden"
          }`}
        >
          <NavigationMenu className="mx-auto">
            <NavigationMenuList className="gap-2 flex-col md:flex-row">
              {user ? (
                <>
                  <NavigationMenuItem>
                    <Link href="/" legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        Home
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <Button variant="secondary" onClick={signOut}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <NavigationMenuItem>
                    <Link href="/register" legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        Register
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/login" legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        Login
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </>
              )}
              <ModeToggle />
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
};

export default Menubar;

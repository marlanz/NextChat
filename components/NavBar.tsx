"use client";

import { useCurrentUser } from "@/services/hooks/useCurrentUser";
import Link from "next/link";
import { Button } from "./ui/button";
import { LogoutButton } from "./logout-button";

const NavBar = () => {
  const { user, loading } = useCurrentUser();

  return (
    <div className="border-b bg-background">
      <nav className="container mx-auto py-4 px-8  justify-between items-center h-full gap-4 flex">
        <Link href={"/"} className="text-xl font-bold">
          NextChat
        </Link>

        {loading || user === null ? (
          <Button asChild>
            <Link href={"/auth/login"}>Sign In</Link>
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {user.user_metadata?.preferred_username || user.email}
            </span>
            <LogoutButton />
          </div>
        )}
      </nav>
    </div>
  );
};

export default NavBar;

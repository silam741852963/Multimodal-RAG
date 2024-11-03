"use client";
import Logo from "./Logo";
import LogInButton from "./LogIn";
import RegisterButton from "./Register";
import ProfileButton from "./Profile";
import { ModeToggle } from "@/components/ui/theme-toggle";
import SearchBar from "./SearchBar";
import LogOutButton from "./LogOut";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { usePathname } from "next/navigation";

export default function Nav() {
  const user = useKindeAuth().isAuthenticated;
  const path = usePathname();
  console.log(user);
  return (
    <nav className="flex justify-between w-full items-center gap-10">
      <Logo scale={0.5} />

      {path == "/search" && <SearchBar />}

      <section className="flex gap-5 pt-5">
        {!user && (
          <>
            <RegisterButton />
            <LogInButton />
          </>
        )}

        {user && (
          <>
            <ProfileButton />
            <LogOutButton />
          </>
        )}

        <ModeToggle />
      </section>
    </nav>
  );
}

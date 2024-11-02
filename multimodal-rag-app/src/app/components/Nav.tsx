import Logo from "./Logo";
import LogInButton from "./LogIn";
import RegisterButton from "./Register";
import ProfileButton from "./Profile";
import { ModeToggle } from "@/components/ui/theme-toggle";
import SearchComponent from "./SearchBar";
import LogOutButton from "./LogOut";

export default function Nav() {
  return (
    <nav className="flex justify-between w-full items-center gap-10">
      <Logo scale={0.5} />
      <SearchComponent />
      <section className="flex gap-5 pt-5">
        <RegisterButton />
        <LogInButton />
        <ProfileButton />
        <LogOutButton />
        <ModeToggle />
      </section>
    </nav>
  );
}

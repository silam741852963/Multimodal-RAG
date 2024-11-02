import { LogOut } from "lucide-react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";

export default function LogOutButton() {
  return (
    <LogoutLink>
      <Button variant="expandIcon" Icon={LogOut} iconPlacement="right">
        Log out
      </Button>
    </LogoutLink>
  );
}

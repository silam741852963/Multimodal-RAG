import { LogIn } from "lucide-react";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";

export default function LogInButton() {
  return (
    <LoginLink>
      <Button variant="expandIcon" Icon={LogIn} iconPlacement="right">
        Log in
      </Button>
    </LoginLink>
  );
}

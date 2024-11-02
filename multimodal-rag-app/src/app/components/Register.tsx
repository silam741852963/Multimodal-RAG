import { LogIn } from "lucide-react";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";

export default function RegisterButton() {
  return (
    <RegisterLink>
      <Button variant="expandIcon" Icon={LogIn} iconPlacement="right">
        Register
      </Button>
    </RegisterLink>
  );
}

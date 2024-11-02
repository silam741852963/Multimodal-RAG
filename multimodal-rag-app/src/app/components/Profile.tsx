import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Link from "next/link";
export default function ProfileButton() {
  return (
    <Link href="/">
      <Button variant="gooeyLeft">
        <User />
      </Button>
    </Link>
  );
}

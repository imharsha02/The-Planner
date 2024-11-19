import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/ui/Typography/TypographyH2";
import Link from "next/link";

const Header = () => {
  return (
    <div className="flex items-center justify-between max-w-7xl">
      <TypographyH2 className="text-center py-3 tracking-wide border-none">
        Planner
      </TypographyH2>
      <div className="flex items-center space-x-3">
        <Button asChild>
          <Link href="/register">Get Started</Link>
        </Button>
      </div>
    </div>
  );
};

export default Header;

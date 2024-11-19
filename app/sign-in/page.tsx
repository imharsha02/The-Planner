import SignInForm from "../components/ui/SignInForm";
import { TypographyP } from "@/components/ui/Typography/TypographyP";
import Link from "next/link";
const page = () => {
  return (
    <div>
      <SignInForm />
      <TypographyP className="text-center text-zinc-400">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="hover:underline">
          Register
        </Link>
      </TypographyP>
    </div>
  );
};

export default page;

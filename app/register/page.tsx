import SignUpForm from "../components/ui/SignUpForm";
import { TypographyP } from "@/components/ui/Typography/TypographyP";
import Link from "next/link";
const page = () => {
  return (
    <div>
      <SignUpForm />
      <TypographyP className="leading-0 text-center text-zinc-400">
        Already have an account?{" "}
        <Link href="/sign-in" className="hover:underline">
          Sign in
        </Link>
      </TypographyP>
    </div>
  );
};

export default page;

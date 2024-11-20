"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/app/lib/supabase";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyH2 } from "@/components/ui/Typography/TypographyH2";
import crypto from "crypto";

const formSchema = z.object({
  identifier: z.string().min(1, "Username or email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof formSchema>;

const SignInForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError("");

    try {
      // Hash the password using the same strategy as SignUpForm
      const hashedPassword = crypto
        .createHash("sha256")
        .update(data.password)
        .digest("hex");

      // Check if identifier is an email
      const isEmail = data.identifier.includes("@");

      // Query the users table
      const { data: users, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .or(
          isEmail
            ? `email.eq.${data.identifier}`
            : `username.eq.${data.identifier}`
        )
        .single();

      if (fetchError) {
        setError("Error fetching user data. Looks like you have to register");
        setTimeout(() => {
          router.push("/register");
        }, 1000);
        return;
      }

      if (!users) {
        setError("User not found");
        router.push("/register");
        return;
      }

      // Verify password
      if (users.password === hashedPassword) {
        router.push("/Home");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred during sign in");
      console.error("Sign in error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-max mx-auto my-10">
      <CardHeader>
        <CardTitle>
          <TypographyH2 className="border-none text-center tracking-wide py-3">
            Sign in to Planner
          </TypographyH2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="max-w-md w-full flex flex-col gap-4 mx-auto"
          >
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username or Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter your username or email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SignInForm;

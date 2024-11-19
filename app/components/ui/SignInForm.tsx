"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
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

// Updated form schema to accept username or email
const formSchema = z.object({
  login: z.string().min(3, "Username or email must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const SignInForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Query the users table to find the user
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .or(`email.eq.${values.login},username.eq.${values.login}`)
        .single();

      if (error || !data) {
        // User not found
        router.push("/register");
        return;
      }

      // Actual login attempt using Supabase auth
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: data.email, // Use the email from the users table
        password: values.password,
      });

      if (authError) {
        // Authentication failed
        router.push("/register");
        return;
      }

      // Successful login
      router.push("/Home");
    } catch {
      router.push("/register");
    } finally {
      setIsLoading(false);
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
            {/* LOGIN FIELD (USERNAME OR EMAIL) */}
            <FormField
              control={form.control}
              name="login"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username or Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter username or email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PASSWORD FIELD */}
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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SignInForm;

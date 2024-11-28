"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
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
import { supabase } from "@/app/lib/supabase";
import { useState } from "react";
import crypto from "crypto";

const formSchema = z
  .object({
    username: z.string().min(2, "Username must be at least 2 characters"),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

type FormData = z.infer<typeof formSchema>;

const SignUpForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError("");

    try {
      // Check for existing username
      const { data: existingUsername } = await supabase
        .from("users")
        .select("username")
        .eq("username", data.username)
        .single();

      if (existingUsername) {
        setError("This username is already taken. Please choose another one.");
        setIsSubmitting(false);
        return;
      }

      // Check for existing email
      const { data: existingEmail } = await supabase
        .from("users")
        .select("email")
        .eq("email", data.email)
        .single();

      if (existingEmail) {
        setError("An account with this email already exists.");
        setIsSubmitting(false);
        return;
      }

      // Add some salt to make the hash more secure
      const salt = crypto.randomBytes(16).toString("hex");
      const hashedPassword = crypto
        .pbkdf2Sync(data.password, salt, 1000, 64, "sha512")
        .toString("hex");

      const { error: insertError } = await supabase.from("users").insert({
        email: data.email,
        username: data.username,
        password: hashedPassword,
        salt: salt, // Store the salt for later verification
      });

      if (insertError) {
        console.error(
          "Error inserting user:",
          insertError.message || insertError
        );
        setError("Error creating user account");
      } else {
        router.push("/Dashboard");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("An error occurred during registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-max mx-auto my-10">
      <CardHeader>
        <CardTitle>
          <TypographyH2 className="border-none tracking-wide text-center py-3">
            Register to Planner
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="What should we call you?"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Email address"
                      type="email"
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
                    <div className="relative w-full">
                      <Input
                        {...field}
                        placeholder="Enter a password"
                        type={showPassword ? "text" : "password"}
                        className="w-full pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        {...field}
                        placeholder="re-type password"
                        type={showConfirmPassword ? "text" : "password"}
                        className="w-full pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      >
                        {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SignUpForm;

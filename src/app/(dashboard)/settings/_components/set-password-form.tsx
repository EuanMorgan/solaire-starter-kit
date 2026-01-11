"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { track } from "@/lib/analytics";
import {
  type SetPasswordInput,
  setPasswordSchema,
} from "@/lib/validations/auth";
import { useTRPC } from "@/trpc/client";

export function SetPasswordForm() {
  const [success, setSuccess] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const setPasswordMutation = useMutation(
    trpc.user.setPassword.mutationOptions({
      onSuccess: () => {
        setSuccess(
          "Password set successfully! You can now sign in with email and password.",
        );
        track("user_set_password");
        form.reset();
        // Invalidate hasPassword query to update UI
        queryClient.invalidateQueries({
          queryKey: trpc.user.hasPassword.queryKey(),
        });
      },
      onError: (err) => {
        setError(err.message ?? "Failed to set password");
      },
    }),
  );

  const form = useForm({
    schema: setPasswordSchema,
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: SetPasswordInput) {
    setSuccess(undefined);
    setError(undefined);
    setPasswordMutation.mutate(data);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Password</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormDescription>
              You signed in with a social account or magic link. Set a password
              to also sign in with email and password.
            </FormDescription>

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      disabled={setPasswordMutation.isPending}
                      {...field}
                    />
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
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm password"
                      disabled={setPasswordMutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormSuccess message={success} />
            <FormError message={error} />

            <Button
              type="submit"
              disabled={setPasswordMutation.isPending}
              loading={setPasswordMutation.isPending}
            >
              Set Password
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { track } from "@/lib/analytics";
import { useTRPC } from "@/trpc/client";

const updateNameSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
});

type UpdateNameInput = z.infer<typeof updateNameSchema>;

interface UpdateNameFormProps {
  currentName: string | null;
}

export function UpdateNameForm({ currentName }: UpdateNameFormProps) {
  const router = useRouter();
  const trpc = useTRPC();

  const [success, setSuccess] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  const updateProfileMutation = useMutation(
    trpc.user.updateProfile.mutationOptions({
      onSuccess: () => {
        setSuccess("Profile updated successfully");
        setError(undefined);
        track("user_updated_profile");
        router.refresh();
      },
      onError: (err) => {
        setError(err.message);
        setSuccess(undefined);
      },
    }),
  );

  const form = useForm({
    schema: updateNameSchema,
    defaultValues: {
      name: currentName ?? "",
    },
  });

  async function onSubmit(data: UpdateNameInput) {
    setSuccess(undefined);
    setError(undefined);
    updateProfileMutation.mutate({ name: data.name });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Name</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your name"
                      disabled={updateProfileMutation.isPending}
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
              disabled={updateProfileMutation.isPending}
              loading={updateProfileMutation.isPending}
            >
              Update Name
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

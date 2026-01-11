"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { FormError } from "@/components/form-error";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { reset, track } from "@/lib/analytics";
import { authClient } from "@/lib/auth-client";

const deleteConfirmSchema = z.object({
  confirmation: z
    .string()
    .refine((val) => val === "DELETE", { message: "Type DELETE to confirm" }),
});

export function DeleteAccountDialog() {
  const router = useRouter();

  const [error, setError] = useState<string | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    schema: deleteConfirmSchema,
    defaultValues: {
      confirmation: "",
    },
  });

  async function onSubmit(_data: { confirmation: string }) {
    setError(undefined);
    setIsSubmitting(true);

    try {
      const result = await authClient.deleteUser();

      if (result.error) {
        setError(result.error.message ?? "Failed to delete account");
        return;
      }

      track("user_deleted_account");
      reset();
      router.push("/login");
      router.refresh();
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>

        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete Account</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove all your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Type <strong>DELETE</strong> to confirm
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="DELETE"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormError message={error} />

                <AlertDialogFooter>
                  <AlertDialogCancel
                    type="button"
                    onClick={() => {
                      form.reset();
                      setError(undefined);
                    }}
                  >
                    Cancel
                  </AlertDialogCancel>
                  {/* Use Button instead of AlertDialogAction to prevent dialog from closing before validation */}
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={isSubmitting}
                    loading={isSubmitting}
                  >
                    Delete Account
                  </Button>
                </AlertDialogFooter>
              </form>
            </Form>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}

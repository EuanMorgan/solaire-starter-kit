"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import {
  AlertDialog,
  AlertDialogAction,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { reset, track } from "@/lib/analytics";
import { signOut } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";

const updateNameSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
});

type UpdateNameInput = z.infer<typeof updateNameSchema>;

const deleteConfirmSchema = z.object({
  confirmation: z
    .string()
    .refine((val) => val === "DELETE", { message: "Type DELETE to confirm" }),
});

type DeleteConfirmInput = { confirmation: string };

export function SettingsContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const { data: user } = useSuspenseQuery(trpc.user.me.queryOptions());

  const [updateSuccess, setUpdateSuccess] = useState<string | undefined>();
  const [updateError, setUpdateError] = useState<string | undefined>();
  const [deleteError, setDeleteError] = useState<string | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const updateProfileMutation = useMutation(
    trpc.user.updateProfile.mutationOptions({
      onSuccess: () => {
        setUpdateSuccess("Profile updated successfully");
        setUpdateError(undefined);
        queryClient.invalidateQueries({ queryKey: trpc.user.me.queryKey() });
        track("user_updated_profile");
      },
      onError: (err) => {
        setUpdateError(err.message);
        setUpdateSuccess(undefined);
      },
    }),
  );

  const deleteAccountMutation = useMutation(
    trpc.user.deleteAccount.mutationOptions({
      onSuccess: async () => {
        track("user_deleted_account");
        reset();
        await signOut();
        router.push("/login");
        router.refresh();
      },
      onError: (err) => {
        setDeleteError(err.message);
      },
    }),
  );

  const updateForm = useForm({
    schema: updateNameSchema,
    defaultValues: {
      name: user.name ?? "",
    },
  });

  useEffect(() => {
    updateForm.reset({ name: user.name ?? "" });
  }, [user.name, updateForm]);

  const deleteForm = useForm({
    schema: deleteConfirmSchema,
    defaultValues: {
      confirmation: "",
    },
  });

  async function onUpdateName(data: UpdateNameInput) {
    setUpdateSuccess(undefined);
    setUpdateError(undefined);
    updateProfileMutation.mutate({ name: data.name });
  }

  async function onDeleteAccount(data: DeleteConfirmInput) {
    setDeleteError(undefined);
    deleteAccountMutation.mutate({ confirmation: data.confirmation });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p>{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Name</p>
                <p>{user.name ?? "Not set"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Update Name</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...updateForm}>
                <form
                  onSubmit={updateForm.handleSubmit(onUpdateName)}
                  className="space-y-4"
                >
                  <FormField
                    control={updateForm.control}
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

                  <FormSuccess message={updateSuccess} />
                  <FormError message={updateError} />

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
        </TabsContent>

        <TabsContent value="security" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                To change your password, use the forgot password flow.
              </p>
              <Button
                variant="outline"
                onClick={() => router.push("/forgot-password")}
              >
                Change Password
              </Button>
            </CardContent>
          </Card>

          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </p>

              <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete Account</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove all your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <Form {...deleteForm}>
                    <form
                      onSubmit={deleteForm.handleSubmit(onDeleteAccount)}
                      className="space-y-4"
                    >
                      <FormField
                        control={deleteForm.control}
                        name="confirmation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Type <strong>DELETE</strong> to confirm
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="DELETE"
                                disabled={deleteAccountMutation.isPending}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormError message={deleteError} />

                      <AlertDialogFooter>
                        <AlertDialogCancel
                          type="button"
                          onClick={() => {
                            deleteForm.reset();
                            setDeleteError(undefined);
                          }}
                        >
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          type="submit"
                          disabled={deleteAccountMutation.isPending}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {deleteAccountMutation.isPending
                            ? "Deleting..."
                            : "Delete Account"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </form>
                  </Form>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

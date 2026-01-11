"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { User } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { ChangePasswordForm } from "./change-password-form";
import { DeleteAccountDialog } from "./delete-account-dialog";
import { SetPasswordForm } from "./set-password-form";
import { UpdateNameForm } from "./update-name-form";

interface SettingsContentProps {
  user: User;
}

export function SettingsContent({ user }: SettingsContentProps) {
  const trpc = useTRPC();
  const { data: hasPassword } = useSuspenseQuery(
    trpc.user.hasPassword.queryOptions(),
  );

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

          <UpdateNameForm currentName={user.name} />
        </TabsContent>

        <TabsContent value="security" className="mt-6 space-y-6">
          {hasPassword ? <ChangePasswordForm /> : <SetPasswordForm />}
          <DeleteAccountDialog />
        </TabsContent>
      </Tabs>
    </div>
  );
}

"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTRPC } from "@/trpc/client";

export function DashboardContent() {
  const trpc = useTRPC();
  const { data: user } = useSuspenseQuery(trpc.user.me.queryOptions());

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Welcome back{user.name ? `, ${user.name}` : ""}!
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <span className="text-muted-foreground">Email:</span>{" "}
            <span>{user.email}</span>
          </p>
          {user.name && (
            <p>
              <span className="text-muted-foreground">Name:</span>{" "}
              <span>{user.name}</span>
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is your dashboard. More features coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

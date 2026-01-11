"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";

interface DashboardContentProps {
  user: User;
}

export function DashboardContent({ user }: DashboardContentProps) {
  const trpc = useTRPC();

  // Data is already hydrated from server prefetch - no loading state needed
  const { data: stats } = useSuspenseQuery(trpc.user.stats.queryOptions());

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
          <CardTitle>Account Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <span className="text-muted-foreground">Account age:</span>{" "}
            <span>
              {stats.accountAgeDays === 0
                ? "Created today"
                : `${stats.accountAgeDays} day${stats.accountAgeDays === 1 ? "" : "s"}`}
            </span>
          </p>
          <p>
            <span className="text-muted-foreground">Email verified:</span>{" "}
            <span>{stats.emailVerified ? "Yes" : "No"}</span>
          </p>
          <p>
            <span className="text-muted-foreground">Profile complete:</span>{" "}
            <span>{stats.profileComplete ? "Yes" : "No"}</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

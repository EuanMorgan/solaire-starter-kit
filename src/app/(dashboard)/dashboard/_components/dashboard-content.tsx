"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface DashboardContentProps {
  user: User;
}

export function DashboardContent({ user }: DashboardContentProps) {
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

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Users,
  TrendingUp,
  Clock,
  Package,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useActivityStore } from "@/store/admin/activityStore";
import { useStatsStore } from "@/store/admin/statsStore";
import { PoundSterling } from 'lucide-react';

export function AdminDashboard() {
  const [page, setPage] = useState(1);
  const { recentActivities, fetchActivities, loading, error, pagination } =
    useActivityStore();
  const {
    stats,
    fetchStats,
    loading: statsLoading,
    error: statsError,
  } = useStatsStore();

  useEffect(() => {
    fetchActivities(page);
    fetchStats();
  }, [fetchActivities, fetchStats, page]);

  const statItems = stats
    ? [
     {
        title: "Total Revenue",
        value: `£${stats.revenue.value.toFixed(2)}`,
        change: `${
          stats.revenue.change >= 0 ? "+" : ""
        }${stats.revenue.change.toFixed(1)}% from last month`,
        changeType: stats.revenue.change >= 0 ? "increase" : "decrease",
        icon: PoundSterling,
      },
        
        {
          title: "Orders",
          value: stats.orders.value.toString(),
          change: `${
            stats.orders.change >= 0 ? "+" : ""
          }${stats.orders.change.toFixed(1)}% from last month`,
          changeType: stats.orders.change >= 0 ? "increase" : "decrease",
          icon: ShoppingCart,
        },
        {
          title: "Clients",
          value: stats.customers.value.toString(),
          change: `${
            stats.customers.change >= 0 ? "+" : ""
          }${stats.customers.change.toFixed(1)}% from last month`,
          changeType: stats.customers.change >= 0 ? "increase" : "decrease",
          icon: Users,
        },
        {
          title: "Growth Rate",
          value: `${stats.growthRate.value.toFixed(1)}%`,
          change: `${
            stats.growthRate.change >= 0 ? "+" : ""
          }${stats.growthRate.change.toFixed(1)}% from last month`,
          changeType: stats.growthRate.change >= 0 ? "increase" : "decrease",
          icon: TrendingUp,
        },
      ]
    : [];

  return (
    <div className="flex flex-col font-[Century-Old-Style]">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-lg font-semibold font-[Century-Old-Style]">Admin Dashboard</h1>
      </header>

      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold font-[Century-Old-Style]">Overview</h2>
            <p className="text-muted-foreground">
              Welcome to your admin dashboard. Here's an overview of your
              business performance.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="h-4 w-24 bg-muted rounded" />
                    <div className="h-4 w-4 bg-muted rounded-full" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="h-6 w-24 bg-muted rounded" />
                    <div className="h-3 w-32 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))
            : statItems.map((stat) => (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>{stat.title}</CardTitle>
                    <stat.icon className="h-4 w-4 text-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p
                      className={`text-xs ${
                        stat.changeType === "increase"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </p>
                  </CardContent>
                </Card>
              ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-1">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <CardTitle>Recent Activities</CardTitle>
              </div>
              <CardDescription>
                Real user activities from the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading && <ActivitySkeleton />}
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="space-y-8">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start justify-between pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                        <Package className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium leading-none">
                          {activity.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                              {activity.description.replace(/€/g, "£")}
                            </p>
                        <div className="text-xs text-muted-foreground">
                          {activity.timestamp
                            ? formatTimestamp(activity.timestamp)
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={
                        activity.type === "created" ? "default" : "secondary"
                      }
                      className="ml-auto"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          {!loading && pagination && (
            <div className="flex justify-between items-center gap-4 mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {(page - 1) * 10 + 1} to{" "}
                {Math.min(page * 10, pagination.total)} of {pagination.total}{" "}
                entries
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

function ActivitySkeleton() {
  return (
    <div className="space-y-8">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-start justify-between pb-4 animate-pulse"
        >
          <div className="flex items-start gap-4">
            <div className="h-8 w-8 rounded-lg bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-48 rounded bg-muted" />
              <div className="h-3 w-32 rounded bg-muted" />
              <div className="h-3 w-24 rounded bg-muted" />
            </div>
          </div>
          <div className="h-6 w-16 rounded bg-muted ml-auto" />
        </div>
      ))}
    </div>
  );
}

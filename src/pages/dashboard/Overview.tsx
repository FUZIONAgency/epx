import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { toast } from "sonner";

const Overview = () => {
  // Fetch all deals with their status
  const { data: dealsData, isLoading, error } = useQuery({
    queryKey: ["deals-overview"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deals")
        .select(`
          *,
          deals_status(name),
          companies(name)
        `);
      if (error) {
        toast.error("Failed to fetch deals data");
        throw error;
      }
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-[400px] bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500">Error loading dashboard data. Please try again later.</div>
      </div>
    );
  }

  // Calculate key metrics
  const totalValue = dealsData?.reduce((sum, deal) => sum + (deal.value || 0), 0) || 0;
  const activeDeals = dealsData?.length || 0;
  const avgDealValue = activeDeals ? totalValue / activeDeals : 0;
  
  // Calculate deals by status for the chart
  const dealsByStatus = dealsData?.reduce((acc: any, deal) => {
    const status = deal.deals_status?.name || "Unknown";
    acc[status] = {
      count: (acc[status]?.count || 0) + 1,
      value: (acc[status]?.value || 0) + (deal.value || 0),
    };
    return acc;
  }, {});

  const chartData = Object.entries(dealsByStatus || {}).map(([name, data]: [string, any]) => ({
    name,
    count: data.count,
    value: data.value,
  }));

  const chartConfig = {
    deals: {
      label: "Deal Count",
      theme: {
        light: "#3b82f6",
        dark: "#60a5fa",
      },
    },
    value: {
      label: "Deal Value",
      theme: {
        light: "#10b981",
        dark: "#34d399",
      },
    },
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Pipeline Value</CardTitle>
            <CardDescription>Current value of all deals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Deals</CardTitle>
            <CardDescription>Number of deals in pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">{activeDeals}</p>
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Deal Value</CardTitle>
            <CardDescription>Mean value per deal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">${avgDealValue.toLocaleString()}</p>
              <ArrowDownIcon className="h-4 w-4 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deals by Status</CardTitle>
          <CardDescription>Distribution of deals across pipeline stages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ChartContainer config={chartConfig}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Bar dataKey="count" yAxisId="left" name="Number of Deals" fill="var(--color-deals)" />
                <Bar dataKey="value" yAxisId="right" name="Total Value" fill="var(--color-value)" />
                <ChartTooltip />
                <ChartLegend />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
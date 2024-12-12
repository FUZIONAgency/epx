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

const Overview = () => {
  const { data: dealsData } = useQuery({
    queryKey: ["deals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deals")
        .select("*, deals_status(name)");
      if (error) throw error;
      return data;
    },
  });

  const totalValue = dealsData?.reduce((sum, deal) => sum + (deal.value || 0), 0) || 0;
  const activeDeals = dealsData?.length || 0;
  
  const dealsByStatus = dealsData?.reduce((acc: any, deal) => {
    const status = deal.deals_status?.name || "Unknown";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(dealsByStatus || {}).map(([name, value]) => ({
    name,
    value,
  }));

  const chartConfig = {
    deals: {
      label: "Deals by Status",
      theme: {
        light: "#3b82f6",
        dark: "#60a5fa"
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Pipeline Value</CardTitle>
            <CardDescription>Current total value of all deals</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Deals</CardTitle>
            <CardDescription>Number of deals in pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{activeDeals}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Deal Value</CardTitle>
            <CardDescription>Mean value per deal</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${activeDeals ? (totalValue / activeDeals).toLocaleString() : 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deals by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer config={chartConfig}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Bar dataKey="value" fill="var(--color-deals)" />
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
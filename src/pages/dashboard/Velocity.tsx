import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";

const Velocity = () => {
  const { data: dealsData } = useQuery({
    queryKey: ["deals-velocity"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deals")
        .select(`
          *,
          deals_status(name)
        `);
      if (error) throw error;
      return data;
    },
  });

  const calculateAverageTimeInStatus = () => {
    const statusDurations: { [key: string]: number[] } = {};
    
    dealsData?.forEach(deal => {
      if (deal.created_at && deal.closed_at && deal.deals_status?.name) {
        const duration = new Date(deal.closed_at).getTime() - new Date(deal.created_at).getTime();
        const durationInDays = duration / (1000 * 60 * 60 * 24);
        
        if (!statusDurations[deal.deals_status.name]) {
          statusDurations[deal.deals_status.name] = [];
        }
        statusDurations[deal.deals_status.name].push(durationInDays);
      }
    });

    return Object.entries(statusDurations).map(([status, durations]) => ({
      name: status,
      value: durations.reduce((sum, duration) => sum + duration, 0) / durations.length,
    }));
  };

  const velocityData = calculateAverageTimeInStatus();

  const chartConfig = {
    velocity: {
      label: "Time in Status",
      theme: {
        light: "#3b82f6",
        dark: "#60a5fa"
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Deal Velocity</h1>

      <Card>
        <CardHeader>
          <CardTitle>Average Time in Status (Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer config={chartConfig}>
              <BarChart data={velocityData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Bar dataKey="value" fill="var(--color-velocity)" />
                <ChartTooltip />
                <ChartLegend />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {velocityData.map((status) => (
          <Card key={status.name}>
            <CardHeader>
              <CardTitle>{status.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{status.value.toFixed(1)} days</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Velocity;
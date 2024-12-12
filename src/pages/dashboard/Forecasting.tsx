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
import { LineChart, Line, XAxis, YAxis } from "recharts";

const Forecasting = () => {
  const { data: dealsData } = useQuery({
    queryKey: ["deals-forecasting"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .order("created_at");
      if (error) throw error;
      return data;
    },
  });

  const getMonthlyData = () => {
    const monthlyData: { [key: string]: number } = {};
    
    dealsData?.forEach(deal => {
      if (deal.created_at) {
        const date = new Date(deal.created_at);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = 0;
        }
        monthlyData[monthYear] += deal.value || 0;
      }
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, value]) => ({
        date,
        value,
      }));
  };

  const monthlyData = getMonthlyData();
  
  const calculateTrend = () => {
    const values = monthlyData.map(d => d.value);
    const movingAverage = values.map((_, index) => {
      if (index < 2) return null;
      const slice = values.slice(index - 2, index + 1);
      return slice.reduce((sum, val) => sum + val, 0) / 3;
    });
    
    return monthlyData.map((data, index) => ({
      ...data,
      trend: movingAverage[index],
    }));
  };

  const trendData = calculateTrend();

  const chartConfig = {
    actual: {
      label: "Actual Revenue",
      theme: {
        light: "#3b82f6",
        dark: "#60a5fa"
      }
    },
    trend: {
      label: "Trend",
      theme: {
        light: "#10b981",
        dark: "#34d399"
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Sales Forecasting</h1>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer config={chartConfig}>
              <LineChart data={trendData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-actual)"
                  name="Actual"
                />
                <Line
                  type="monotone"
                  dataKey="trend"
                  stroke="var(--color-trend)"
                  name="Trend"
                  strokeDasharray="5 5"
                />
                <ChartTooltip />
                <ChartLegend />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Current Quarter Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${(monthlyData[monthlyData.length - 1]?.value * 3).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${(monthlyData.reduce((sum, data) => sum + data.value, 0) / monthlyData.length).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Growth Rate</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyData.length > 1 && (
              <p className="text-2xl font-bold">
                {(((monthlyData[monthlyData.length - 1].value / monthlyData[monthlyData.length - 2].value) - 1) * 100).toFixed(1)}%
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Forecasting;
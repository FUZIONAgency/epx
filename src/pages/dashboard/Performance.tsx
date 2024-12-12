import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";

const Performance = () => {
  const { data: dealsData } = useQuery({
    queryKey: ["deals-performance"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deals")
        .select(`
          *,
          persons(name)
        `);
      if (error) throw error;
      return data;
    },
  });

  const performanceByPerson = dealsData?.reduce((acc: any, deal) => {
    const person = deal.persons?.name || "Unassigned";
    if (!acc[person]) {
      acc[person] = {
        totalValue: 0,
        dealCount: 0,
        closedDeals: 0,
      };
    }
    acc[person].totalValue += deal.value || 0;
    acc[person].dealCount += 1;
    if (deal.closed_at) acc[person].closedDeals += 1;
    return acc;
  }, {});

  const chartData = Object.entries(performanceByPerson || {}).map(([name, data]: [string, any]) => ({
    name,
    value: data.totalValue,
  }));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Sales Performance</h1>

      <Card>
        <CardHeader>
          <CardTitle>Performance by Sales Rep</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Bar dataKey="value" fill="#3b82f6" />
                <ChartTooltip />
                <ChartLegend />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sales Rep</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Deal Count</TableHead>
                <TableHead>Closed Deals</TableHead>
                <TableHead>Success Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(performanceByPerson || {}).map(([name, data]: [string, any]) => (
                <TableRow key={name}>
                  <TableCell>{name}</TableCell>
                  <TableCell>${data.totalValue.toLocaleString()}</TableCell>
                  <TableCell>{data.dealCount}</TableCell>
                  <TableCell>{data.closedDeals}</TableCell>
                  <TableCell>
                    {((data.closedDeals / data.dealCount) * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Performance;
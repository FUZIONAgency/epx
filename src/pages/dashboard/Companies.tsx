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
import { PieChart, Pie, Cell } from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Companies = () => {
  const { data: companiesData } = useQuery({
    queryKey: ["companies-with-deals"],
    queryFn: async () => {
      const { data: companies, error: companiesError } = await supabase
        .from("companies")
        .select(`
          *,
          deals(
            value,
            closed_at,
            deals_status(name)
          )
        `);
      if (companiesError) throw companiesError;
      return companies;
    },
  });

  const companyMetrics = companiesData?.map(company => {
    const totalValue = company.deals?.reduce((sum, deal) => sum + (deal.value || 0), 0) || 0;
    const dealCount = company.deals?.length || 0;
    const closedDeals = company.deals?.filter(deal => deal.closed_at)?.length || 0;
    
    return {
      name: company.name,
      totalValue,
      dealCount,
      closedDeals,
      successRate: dealCount ? (closedDeals / dealCount) * 100 : 0,
    };
  }).sort((a, b) => b.totalValue - a.totalValue) || [];

  const pieData = companyMetrics
    .slice(0, 5)
    .map(company => ({
      name: company.name,
      value: company.totalValue,
    }));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Company Analytics</h1>

      <Card>
        <CardHeader>
          <CardTitle>Top 5 Companies by Deal Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex justify-center">
            <ChartContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip />
                <ChartLegend />
              </PieChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Company Performance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Deal Count</TableHead>
                <TableHead>Closed Deals</TableHead>
                <TableHead>Success Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companyMetrics.map((company) => (
                <TableRow key={company.name}>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>${company.totalValue.toLocaleString()}</TableCell>
                  <TableCell>{company.dealCount}</TableCell>
                  <TableCell>{company.closedDeals}</TableCell>
                  <TableCell>{company.successRate.toFixed(1)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Companies;
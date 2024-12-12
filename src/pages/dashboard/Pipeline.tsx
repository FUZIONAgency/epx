import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Pipeline = () => {
  const { data: dealsData } = useQuery({
    queryKey: ["deals-with-status"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deals")
        .select(`
          *,
          deals_status(name),
          companies(name),
          persons(name)
        `);
      if (error) throw error;
      return data;
    },
  });

  const dealsByStatus = dealsData?.reduce((acc: any, deal) => {
    const status = deal.deals_status?.name || "Unknown";
    if (!acc[status]) acc[status] = [];
    acc[status].push(deal);
    return acc;
  }, {});

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Deal Pipeline</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(dealsByStatus || {}).map(([status, deals]: [string, any]) => (
          <Card key={status} className="min-h-[500px]">
            <CardHeader>
              <CardTitle>{status}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {deals.length} deals - ${deals.reduce((sum: number, deal: any) => sum + (deal.value || 0), 0).toLocaleString()}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deals.map((deal: any) => (
                  <Card key={deal.id} className="p-4">
                    <h3 className="font-medium">{deal["deal-code"]}</h3>
                    <p className="text-sm text-muted-foreground">{deal.companies?.name}</p>
                    <p className="text-sm font-medium mt-2">${deal.value?.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">Owner: {deal.persons?.name}</p>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Pipeline;
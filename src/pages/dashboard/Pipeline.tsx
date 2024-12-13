import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { toast } from "sonner";

const getBackgroundColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'lost':
      return 'bg-red-50';
    case 'won':
      return 'bg-green-50';
    case 'closed':
    case 'cancelled':
      return 'bg-yellow-50';
    default:
      return 'bg-white';
  }
};

const Pipeline = () => {
  const queryClient = useQueryClient();

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

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const sourceStatus = result.source.droppableId;
    const destinationStatus = result.destination.droppableId;
    
    if (sourceStatus === destinationStatus) return;

    const dealId = result.draggableId;
    
    // Find the status ID for the destination column
    const destinationStatusData = await supabase
      .from('deals_status')
      .select('id')
      .eq('name', destinationStatus)
      .single();

    if (destinationStatusData.error) {
      toast.error('Failed to update deal status');
      return;
    }

    // Update the deal's status
    const { error } = await supabase
      .from('deals')
      .update({ status_id: destinationStatusData.data.id })
      .eq('id', dealId);

    if (error) {
      toast.error('Failed to update deal status');
      return;
    }

    // Invalidate and refetch the deals query
    queryClient.invalidateQueries({ queryKey: ["deals-with-status"] });
    toast.success(`Deal moved to ${destinationStatus}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Deal Pipeline</h1>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(dealsByStatus || {}).map(([status, deals]: [string, any]) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <Card 
                  className={`min-h-[500px] ${getBackgroundColor(status)}`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <CardHeader>
                    <CardTitle>{status}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {deals.length} deals - ${deals.reduce((sum: number, deal: any) => sum + (deal.value || 0), 0).toLocaleString()}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {deals.map((deal: any, index: number) => (
                        <Draggable 
                          key={deal.id} 
                          draggableId={deal.id} 
                          index={index}
                        >
                          {(provided) => (
                            <Card 
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="p-4 hover:shadow-md transition-shadow"
                            >
                              <h3 className="font-medium">{deal["deal-code"]}</h3>
                              <p className="text-sm text-muted-foreground">{deal.companies?.name}</p>
                              <p className="text-sm font-medium mt-2">${deal.value?.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground mt-1">Owner: {deal.persons?.name}</p>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </CardContent>
                </Card>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Pipeline;
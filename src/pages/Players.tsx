import { useState, useEffect } from "react";
import { Search, Eye, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getPlayers, verifyPlayer, deletePlayer, Player } from "@/services/players";
import { toast } from "sonner";

const Players = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const data = await getPlayers();
      // Map API data to UI model
      const mappedPlayers = data.map((p: any) => ({
        id: p.playerId,
        name: `${p.firstName} ${p.lastName}`,
        agent: p.agentId || "Unknown Agent",
        status: p.adminApprovalStatus || "Pending",
        lastUpdated: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : "N/A",
        details: p
      }));
      setPlayers(mappedPlayers);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load players");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id: string) => {
    try {
      await verifyPlayer(id);
      toast.success("Player verified successfully");
      fetchPlayers();
    } catch (error: any) {
      toast.error(error.message || "Failed to verify player");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this player?")) return;
    try {
      await deletePlayer(id);
      toast.success("Player deleted successfully");
      fetchPlayers();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete player");
    }
  };

  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.agent.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
      case "active":
        return "default";
      case "pending":
      case "submitted":
        return "secondary";
      case "rejected":
      case "inactive":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Player Management</h1>
        <p className="text-muted-foreground mt-1">Review and manage player submissions</p>
      </div>

      <Card className="shadow-md">
        <div className="p-6 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search players or agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player Name</TableHead>
              <TableHead>Assigned Agent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">Loading players...</TableCell>
              </TableRow>
            ) : filteredPlayers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">No players found.</TableCell>
              </TableRow>
            ) : (
              filteredPlayers.map((player) => (
                <TableRow key={player.id}>
                  <TableCell className="font-medium">{player.name}</TableCell>
                  <TableCell className="max-w-[150px] truncate" title={player.agent}>{player.agent}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(player.status)}>
                      {player.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{player.lastUpdated}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-full sm:max-w-xl bg-background">
                          <SheetHeader>
                            <SheetTitle>{player.name}</SheetTitle>
                            <SheetDescription>Player Profile & Documents</SheetDescription>
                          </SheetHeader>
                          <div className="mt-6 space-y-6">
                            <div>
                              <h3 className="font-semibold mb-3">Profile Information</h3>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Assigned Agent:</span>
                                  <span className="font-medium">{player.agent}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Status:</span>
                                  <Badge variant={getStatusVariant(player.status)}>{player.status}</Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Main Position:</span>
                                  <span className="font-medium">{player.details.mainPosition || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Club:</span>
                                  <span className="font-medium">{player.details.currentClub || 'Free Agent'}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-3 mt-8">
                              {player.status.toLowerCase() !== 'approved' && (
                                <Button className="flex-1" onClick={() => handleVerify(player.id)}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve
                                </Button>
                              )}
                              <Button variant="destructive" className="flex-1" onClick={() => handleDelete(player.id)}>
                                <XCircle className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>


        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredPlayers.length} players
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Players;

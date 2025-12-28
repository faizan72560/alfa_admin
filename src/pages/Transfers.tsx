import { useState, useEffect } from "react";
import { Search, Calendar, Eye, Clock, History } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTransfers, updateTransferStatus, getTransferById } from "@/services/transfers";
import { exportTransfers } from "@/services/admin";
import { toast } from "sonner";
import { Download, MoreVertical, CheckCircle, XCircle, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Transfers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [transfers, setTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<any | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchTransfers();
  }, [statusFilter]);

  const fetchTransfers = async () => {
    try {
      setLoading(true);
      const data = await getTransfers(100, 0, statusFilter === "all" ? undefined : statusFilter);
      // Map API data
      const mappedTransfers = data.map((t: any) => ({
        id: t.id,
        player: t.player ? `${t.player.firstName} ${t.player.lastName}` : `Player ${t.playerId?.substring(0, 8) || 'Unknown'}`,
        agent: t.agent ? `${t.agent.firstName} ${t.agent.lastName}` : `Agent ${t.agentId || 'Unknown'}`,
        currentClub: t.player?.currentClub || "Unknown Club",
        requestedClub: "N/A",
        status: t.status,
        date: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'N/A',
        raw: t
      }));
      setTransfers(mappedTransfers);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load transfers");
    } finally {
      setLoading(false);
    }
  };

  const currentFilteredTransfers = transfers.filter((transfer) => {
    const searchLower = searchTerm.toLowerCase();
    return transfer.player.toLowerCase().includes(searchLower) ||
      transfer.agent.toLowerCase().includes(searchLower) ||
      transfer.currentClub.toLowerCase().includes(searchLower);
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completed": return "default";
      case "Approved": return "default";
      case "Pending": return "secondary";
      case "In Review": return "outline";
      case "Rejected": return "destructive";
      default: return "secondary";
    }
  };

  const handleStatusChange = async (transferId: number, newStatus: string) => {
    try {
      await updateTransferStatus(transferId, newStatus);
      toast.success(`Transfer status updated to ${newStatus}`);
      fetchTransfers();
    } catch (error: any) {
      toast.error("Failed to update status");
    }
  };

  const handleExport = async (format: 'csv' | 'xlsx') => {
    try {
      setExporting(true);
      const blob = await exportTransfers(format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transfers-export-${new Date().getTime()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success(`Transfers exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error("Failed to export transfers");
    } finally {
      setExporting(false);
    }
  };

  const handleViewDetails = async (id: number) => {
    try {
      setDetailLoading(true);
      const data = await getTransferById(id);
      setSelectedTransfer(data);
      setIsDetailModalOpen(true);
    } catch (error) {
      toast.error("Failed to load transfer details");
    } finally {
      setDetailLoading(false);
    }
  };

  const getCount = (status: string) => transfers.filter(t => t.status === status).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transfer Requests</h1>
          <p className="text-muted-foreground mt-1">Track and manage all transfer requests</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" disabled={exporting}>
              <Download className="h-4 w-4 mr-2" />
              {exporting ? "Exporting..." : "Export Requests"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuItem onClick={() => handleExport('csv')}>CSV Format</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('xlsx')}>Excel Format</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card className="shadow-md">
        <div className="p-6 border-b border-border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by player, agent, or club..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>


        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Current Club</TableHead>
              {/* <TableHead>Requested Club</TableHead> Removed as likely not in data */}
              <TableHead>Status</TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">Loading transfers...</TableCell>
              </TableRow>
            ) : currentFilteredTransfers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">No transfers found.</TableCell>
              </TableRow>
            ) : (
              currentFilteredTransfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell className="font-medium">{transfer.player}</TableCell>
                  <TableCell>{transfer.agent}</TableCell>
                  <TableCell>{transfer.currentClub}</TableCell>
                  {/* <TableCell className="font-medium text-primary">{transfer.requestedClub}</TableCell> */}
                  <TableCell>
                    <Badge variant={getStatusVariant(transfer.status)}>
                      {transfer.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{transfer.date}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(transfer.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Select
                        defaultValue={transfer.status}
                        onValueChange={(value) => handleStatusChange(transfer.id, value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Approved">Approved</SelectItem>
                          <SelectItem value="Rejected">Rejected</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {currentFilteredTransfers.length} transfer requests
          </p>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 shadow-md">
          <h3 className="font-semibold text-lg mb-2">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {getCount('Pending')}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Awaiting review</p>
        </Card>
        <Card className="p-6 shadow-md">
          <h3 className="font-semibold text-lg mb-2">Approved</h3>
          <p className="text-3xl font-bold text-green-600">
            {getCount('Approved')}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Ready for next steps</p>
        </Card>
        <Card className="p-6 shadow-md">
          <h3 className="font-semibold text-lg mb-2">Rejected</h3>
          <p className="text-3xl font-bold text-red-600">
            {getCount('Rejected')}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Closed requests</p>
        </Card>
      </div>

      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl bg-popover">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Transfer Audit Detail
            </DialogTitle>
            <DialogDescription>
              In-depth view and status history for this transfer request.
            </DialogDescription>
          </DialogHeader>

          {selectedTransfer && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-6 bg-muted/50 p-4 rounded-xl border border-border">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Player</p>
                  <p className="font-semibold text-lg">{selectedTransfer.player?.firstName} {selectedTransfer.player?.lastName}</p>
                  <p className="text-sm text-muted-foreground">{selectedTransfer.player?.currentClub || 'No Current Club'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Agent</p>
                  <p className="font-semibold text-lg">{selectedTransfer.agent?.firstName} {selectedTransfer.agent?.lastName}</p>
                  <p className="text-sm text-muted-foreground">Request Holder</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 font-semibold">
                  <Clock className="h-4 w-4 text-primary" />
                  Status Audit Trail
                </div>
                <div className="space-y-3 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border">
                  <div className="flex items-start gap-4 relative pl-6">
                    <div className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full bg-primary border-4 border-background" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Current Status: {selectedTransfer.status}</p>
                        <p className="text-xs text-muted-foreground">{new Date(selectedTransfer.updatedAt).toLocaleString()}</p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        The transfer is currently in {selectedTransfer.status.toLowerCase()} state.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 relative pl-6 opacity-60">
                    <div className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full bg-muted-foreground/30 border-4 border-background" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Request Initiated</p>
                        <p className="text-xs text-muted-foreground">{new Date(selectedTransfer.createdAt).toLocaleString()}</p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Initial submission by {selectedTransfer.agent?.firstName} {selectedTransfer.agent?.lastName}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedTransfer.message && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 font-semibold">
                    <Info className="h-4 w-4 text-primary" />
                    Agent's Comments
                  </div>
                  <div className="p-4 bg-muted border border-border rounded-lg text-sm italic">
                    "{selectedTransfer.message}"
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button onClick={() => setIsDetailModalOpen(false)}>Close Audit View</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Transfers;

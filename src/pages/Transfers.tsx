import { useState } from "react";
import { Search, Calendar } from "lucide-react";
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

const mockTransfers = [
  { id: 1, player: "Alex Martinez", agent: "John Doe", currentClub: "FC Barcelona", requestedClub: "Real Madrid", status: "Pending", date: "2024-01-15" },
  { id: 2, player: "Chris Anderson", agent: "John Doe", currentClub: "Manchester United", requestedClub: "Chelsea FC", status: "In Review", date: "2024-01-14" },
  { id: 3, player: "Jordan Lee", agent: "Jane Smith", currentClub: "Bayern Munich", requestedClub: "PSG", status: "Completed", date: "2024-01-10" },
  { id: 4, player: "Taylor Brown", agent: "Jane Smith", currentClub: "Liverpool FC", requestedClub: "Arsenal", status: "Rejected", date: "2024-01-08" },
  { id: 5, player: "Casey Wilson", agent: "John Doe", currentClub: "AC Milan", requestedClub: "Juventus", status: "Pending", date: "2024-01-12" },
];

const Transfers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTransfers = mockTransfers.filter((transfer) => {
    const matchesSearch = transfer.player.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.agent.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.currentClub.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.requestedClub.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || transfer.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completed": return "active";
      case "Pending": return "pending";
      case "In Review": return "warning";
      case "Rejected": return "destructive";
      default: return "secondary";
    }
  };

  const handleStatusChange = (transferId: number, newStatus: string) => {
    console.log(`Updating transfer ${transferId} to status: ${newStatus}`);
    // This would update the transfer status in your backend
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Transfer Requests</h1>
        <p className="text-muted-foreground mt-1">Track and manage all transfer requests</p>
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in review">In Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
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
              <TableHead>Requested Club</TableHead>
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
            {filteredTransfers.map((transfer) => (
              <TableRow key={transfer.id}>
                <TableCell className="font-medium">{transfer.player}</TableCell>
                <TableCell>{transfer.agent}</TableCell>
                <TableCell>{transfer.currentClub}</TableCell>
                <TableCell className="font-medium text-primary">{transfer.requestedClub}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(transfer.status)}>
                    {transfer.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{transfer.date}</TableCell>
                <TableCell className="text-right">
                  <Select
                    defaultValue={transfer.status.toLowerCase()}
                    onValueChange={(value) => handleStatusChange(transfer.id, value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in review">In Review</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredTransfers.length} of {mockTransfers.length} transfer requests
          </p>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 shadow-md">
          <h3 className="font-semibold text-lg mb-2">Pending</h3>
          <p className="text-3xl font-bold text-warning">
            {mockTransfers.filter(t => t.status === "Pending").length}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Awaiting review</p>
        </Card>
        <Card className="p-6 shadow-md">
          <h3 className="font-semibold text-lg mb-2">In Review</h3>
          <p className="text-3xl font-bold text-primary">
            {mockTransfers.filter(t => t.status === "In Review").length}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Being processed</p>
        </Card>
        <Card className="p-6 shadow-md">
          <h3 className="font-semibold text-lg mb-2">Completed</h3>
          <p className="text-3xl font-bold text-success">
            {mockTransfers.filter(t => t.status === "Completed").length}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Successfully processed</p>
        </Card>
      </div>
    </div>
  );
};

export default Transfers;

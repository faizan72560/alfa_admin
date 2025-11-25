import { useState } from "react";
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

const mockPlayers = [
  { id: 1, name: "Alex Martinez", agent: "John Doe", status: "Pending Review", lastUpdated: "2024-01-15", progress: 60 },
  { id: 2, name: "Chris Anderson", agent: "John Doe", status: "Approved", lastUpdated: "2024-01-14", progress: 100 },
  { id: 3, name: "Jordan Lee", agent: "Jane Smith", status: "Revision Needed", lastUpdated: "2024-01-13", progress: 40 },
  { id: 4, name: "Taylor Brown", agent: "Jane Smith", status: "Pending Review", lastUpdated: "2024-01-12", progress: 75 },
  { id: 5, name: "Casey Wilson", agent: "John Doe", status: "Submitted", lastUpdated: "2024-01-11", progress: 85 },
];

const Players = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPlayers = mockPlayers.filter((player) =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.agent.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Approved": return "active";
      case "Pending Review": return "pending";
      case "Submitted": return "pending";
      case "Revision Needed": return "warning";
      default: return "secondary";
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
              <TableHead>Progress</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlayers.map((player) => (
              <TableRow key={player.id}>
                <TableCell className="font-medium">{player.name}</TableCell>
                <TableCell>{player.agent}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(player.status)}>
                    {player.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${player.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">{player.progress}%</span>
                  </div>
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
                                <span className="text-muted-foreground">Last Updated:</span>
                                <span className="font-medium">{player.lastUpdated}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-3">Timeline</h3>
                            <div className="space-y-4">
                              {[
                                { stage: "Profile Created", date: "2024-01-05", completed: true },
                                { stage: "Documents Uploaded", date: "2024-01-08", completed: true },
                                { stage: "Initial Review", date: "2024-01-12", completed: player.progress >= 60 },
                                { stage: "Final Approval", date: "Pending", completed: player.progress === 100 },
                              ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                  <div className={`h-2 w-2 rounded-full mt-2 ${item.completed ? 'bg-success' : 'bg-muted'}`}></div>
                                  <div className="flex-1">
                                    <p className={`text-sm ${item.completed ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                                      {item.stage}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-3 pt-4 border-t border-border">
                            <Button className="flex-1 bg-success hover:bg-success/90 text-success-foreground">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button variant="outline" className="flex-1">
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Send Back
                            </Button>
                            <Button variant="destructive" className="flex-1">
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredPlayers.length} of {mockPlayers.length} players
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Players;

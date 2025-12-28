import { useState, useEffect } from "react";
import { Search, Plus, Filter, MoreVertical, Edit, Eye, CheckCircle, XCircle, Download, Loader2, Globe, Calendar, Mail, User } from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAgents, updateAgentStatus, approveAgent, Agent, getAgentById, getAgentPlayers } from "@/services/agents";
import { exportUsers } from "@/services/admin";
import { toast } from "sonner";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const [selectedAgent, setSelectedAgent] = useState<any | null>(null);
  const [agentDetails, setAgentDetails] = useState<{ profile: any, players: any[] } | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const data = await getAgents(100, 0);
      const mappedUsers = data.map((agent: Agent) => ({
        id: agent.agentId,
        name: `${agent.firstName} ${agent.lastName}`,
        email: agent.email,
        role: "Agent",
        status: agent.status,
        agent: "N/A",
        pending: agent.status === "Pending" || agent.status === "Submitted",
        raw: agent
      }));
      setUsers(mappedUsers);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      if (newStatus === "Approved") {
        await approveAgent(id);
      } else {
        await updateAgentStatus(id, newStatus);
      }
      toast.success(`Agent status updated to ${newStatus}`);
      fetchAgents();
      if (selectedAgent && selectedAgent.id === id) {
        handleViewDetails(selectedAgent); // Refresh details
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleViewDetails = async (agent: any) => {
    try {
      setSelectedAgent(agent);
      setLoadingDetails(true);
      const [profile, players] = await Promise.all([
        getAgentById(agent.id),
        getAgentPlayers(agent.id)
      ]);
      setAgentDetails({ profile, players });
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch agent details");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleExport = async (format: 'csv' | 'xlsx') => {
    try {
      setExporting(true);
      const blob = await exportUsers(format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-export-${new Date().getTime()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success(`Users exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error("Failed to export users");
    } finally {
      setExporting(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage all users, agents, and members</p>
        </div>
        <div className="flex gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={exporting}>
                <Download className="h-4 w-4 mr-2" />
                {exporting ? "Exporting..." : "Export"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover">
              <DropdownMenuItem onClick={() => handleExport('csv')}>CSV Format</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('xlsx')}>Excel Format</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-md">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-popover">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>Create a new user account in the system</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="email@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="agent">Agent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground">
                    Create User
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="shadow-md">
        <div className="p-6 border-b border-border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned Agent</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">Loading users...</TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">No users found.</TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "Agent" ? "default" : "secondary"}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "Approved" || user.status === "Active" ? "default" :
                          user.status === "Pending" || user.status === "Submitted" ? "secondary" : "destructive"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.agent}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover">
                        <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit User
                        </DropdownMenuItem>
                        {user.pending && (
                          <>
                            <DropdownMenuItem className="text-green-600" onClick={() => handleStatusChange(user.id, "Approved")}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve Agent
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleStatusChange(user.id, "Rejected")}>
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject Request
                            </DropdownMenuItem>
                          </>
                        )}
                        {!user.pending && (
                          <DropdownMenuItem
                            className={user.status === "Active" || user.status === "Approved" ? "text-red-500" : "text-green-500"}
                            onClick={() => handleStatusChange(user.id, user.status === "Active" || user.status === "Approved" ? "Inactive" : "Active")}
                          >
                            {user.status === "Active" || user.status === "Approved" ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredUsers.length} users
          </p>
        </div>
      </Card>

      {/* Detailed Agent Profile Dialog */}
      <Dialog open={!!selectedAgent} onOpenChange={(open) => !open && setSelectedAgent(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-popover">
          <DialogHeader>
            <DialogTitle>Agent Profile Detailed Review</DialogTitle>
            <DialogDescription>Full audit of agent information and listed players</DialogDescription>
          </DialogHeader>

          {loadingDetails ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-muted-foreground font-medium">Fetching details...</p>
            </div>
          ) : agentDetails ? (
            <div className="space-y-6 mt-4">
              <div className="flex flex-col md:flex-row gap-6 p-4 bg-accent/50 rounded-xl border border-border">
                <div className="h-24 w-24 rounded-2xl bg-primary/10 flex items-center justify-center border-2 border-primary/20 overflow-hidden">
                  {agentDetails.profile.profilePhotoUrl ? (
                    <img src={agentDetails.profile.profilePhotoUrl} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-10 w-10 text-primary" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-foreground">
                      {agentDetails.profile.firstName} {agentDetails.profile.lastName}
                    </h3>
                    <Badge variant={agentDetails.profile.status === "Active" || agentDetails.profile.status === "Approved" ? "default" : "secondary"}>
                      {agentDetails.profile.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" /> {agentDetails.profile.email}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="h-3.5 w-3.5" /> {agentDetails.profile.country || "Not specified"}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" /> Member since {new Date(agentDetails.profile.createdAt).toLocaleDateString()}
                    </div>
                    {agentDetails.profile.companyWebsite && (
                      <div className="flex items-center gap-2 text-primary">
                        <Globe className="h-3.5 w-3.5" />
                        <a href={agentDetails.profile.companyWebsite} target="_blank" rel="noreferrer" className="hover:underline">
                          {agentDetails.profile.companyWebsite}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status and Analytics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-card border border-border rounded-lg text-center">
                  <div className="text-2xl font-bold">{agentDetails.players.length}</div>
                  <div className="text-[10px] text-muted-foreground uppercase font-bold">Total Players</div>
                </div>
                <div className="p-3 bg-card border border-border rounded-lg text-center">
                  <div className="text-2xl font-bold">{agentDetails.players.filter((p: any) => p.adminApprovalStatus === 'Approved').length}</div>
                  <div className="text-[10px] text-muted-foreground uppercase font-bold">Approved Players</div>
                </div>
              </div>

              {/* Players Table */}
              <div className="space-y-3">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <User className="h-4 w-4" /> Players Under Management
                </h4>
                {agentDetails.players.length > 0 ? (
                  <div className="rounded-md border border-border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-accent/50">
                        <TableRow>
                          <TableHead className="py-2 h-auto text-[11px] font-bold">Player Name</TableHead>
                          <TableHead className="py-2 h-auto text-[11px] font-bold">Club</TableHead>
                          <TableHead className="py-2 h-auto text-[11px] font-bold">Position</TableHead>
                          <TableHead className="py-2 h-auto text-[11px] font-bold">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {agentDetails.players.map((player: any) => (
                          <TableRow key={player.id} className="h-10">
                            <TableCell className="py-2 text-sm">{player.firstName} {player.lastName}</TableCell>
                            <TableCell className="py-2 text-xs text-muted-foreground">{player.currentClub || "N/A"}</TableCell>
                            <TableCell className="py-2 text-xs text-muted-foreground font-medium">{player.position || "N/A"}</TableCell>
                            <TableCell className="py-2">
                              <Badge variant={player.adminApprovalStatus === "Approved" ? "default" : "secondary"} className="text-[10px] h-4">
                                {player.adminApprovalStatus}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="p-8 border border-dashed border-border rounded-lg text-center text-muted-foreground italic text-sm">
                    No players found for this agent.
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4 gap-3 border-t border-border">
                <Button variant="outline" onClick={() => setSelectedAgent(null)}>Close Review</Button>
                {agentDetails.profile.status !== "Active" && agentDetails.profile.status !== "Approved" && (
                  <Button onClick={() => handleStatusChange(agentDetails.profile.agentId, "Approved")}>Approve Agent Now</Button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">Error loading details.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;

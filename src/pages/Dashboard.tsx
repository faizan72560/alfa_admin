import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCog, GitPullRequest, CheckCircle, Loader2, Trophy, Megaphone } from "lucide-react";
import { getAgents } from "@/services/agents";
import { getPlayers, getRankedPlayers } from "@/services/players";
import { getTransfers } from "@/services/transfers";
import { broadcastNotification } from "@/services/notifications";
import { BASE_URL } from "@/services/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activePlayers: 0,
    pendingTransfers: 0,
    completedRequests: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [rankedPlayers, setRankedPlayers] = useState<any[]>([]);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastData, setBroadcastData] = useState({ title: "", message: "" });
  const [sendingBroadcast, setSendingBroadcast] = useState(false);

  useEffect(() => {
    fetchDashboardData();

    // Setup SSE for real-time alerts
    const token = localStorage.getItem('accessToken');
    const sseUrl = `${BASE_URL}/notifications/stream?token=${token}`;
    const eventSource = new EventSource(sseUrl);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        toast(data.title || "New Notification", {
          description: data.message,
          action: {
            label: "Refresh",
            onClick: () => fetchDashboardData(),
          },
        });

        // Refresh dashboard data automatically for certain event types
        if (data.type === 'NEW_AGENT' || data.type === 'TRANSFER_REQUEST') {
          fetchDashboardData();
        }
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE Connection Error:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [agentsData, playersData, transfersData, rankedData] = await Promise.all([
        getAgents(100, 0),
        getPlayers(),
        getTransfers(100, 0),
        getRankedPlayers()
      ]);

      const pendingTransfers = transfersData.filter(t => t.status === 'Pending').length;
      const completedRequests = transfersData.filter(t => t.status === 'Completed').length;

      setStats({
        totalUsers: agentsData.length,
        activePlayers: playersData.length,
        pendingTransfers,
        completedRequests,
      });

      const activities = [
        ...agentsData.slice(0, 4).map(a => ({
          user: `${a.firstName} ${a.lastName}`,
          action: "registered as new agent",
          time: a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "Recently",
          rawTime: a.createdAt ? new Date(a.createdAt).getTime() : 0
        })),
        ...transfersData.slice(0, 4).map(t => ({
          user: t.agent ? `${t.agent.firstName} ${t.agent.lastName}` : "Agent",
          action: "submitted transfer request",
          time: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "Recently",
          rawTime: t.createdAt ? new Date(t.createdAt).getTime() : 0
        }))
      ].sort((a, b) => b.rawTime - a.rawTime).slice(0, 5);

      setRecentActivity(activities);
      setRankedPlayers(rankedData.slice(0, 5));

    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastData.title || !broadcastData.message) {
      toast.error("Please fill in both title and message");
      return;
    }
    try {
      setSendingBroadcast(true);
      await broadcastNotification(broadcastData);
      toast.success("Broadcast sent to all agents");
      setIsBroadcastModalOpen(false);
      setBroadcastData({ title: "", message: "" });
    } catch (error) {
      toast.error("Failed to send broadcast");
    } finally {
      setSendingBroadcast(false);
    }
  };

  const statConfig = [
    {
      title: "Total Agents",
      value: stats.totalUsers,
      icon: Users,
      description: "Approved & Pending",
      color: "text-primary",
    },
    {
      title: "Active Players",
      value: stats.activePlayers,
      icon: UserCog,
      description: "Verified profiles",
      color: "text-emerald-500",
    },
    {
      title: "Pending Transfers",
      value: stats.pendingTransfers,
      icon: GitPullRequest,
      description: "Requires attention",
      color: "text-amber-500",
    },
    {
      title: "Completed Requests",
      value: stats.completedRequests,
      icon: CheckCircle,
      description: "Processed interests",
      color: "text-emerald-500",
    },
  ];

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Loading overview data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's an overview of your admin panel.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statConfig.map((stat) => (
          <Card key={stat.title} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start space-x-3 border-b border-border last:border-0 pb-3 last:pb-0">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium text-foreground">{activity.user}</span>{" "}
                        <span className="text-muted-foreground">{activity.action}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent activity found.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <button
                className="px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors text-left shadow-sm w-full"
                onClick={() => setIsBroadcastModalOpen(true)}
              >
                <div className="font-medium flex items-center gap-2">
                  <Megaphone className="h-4 w-4" />
                  Send Announcement
                </div>
                <div className="text-sm opacity-90 mt-1">Broadcast to all agents</div>
              </button>
              <button className="px-4 py-3 bg-card border border-border rounded-lg hover:bg-accent transition-colors text-left shadow-sm w-full">
                <div className="font-medium text-foreground">Process Transfers</div>
                <div className="text-sm text-muted-foreground mt-1">Manage pending approvals</div>
              </button>
              <button className="px-4 py-3 bg-card border border-border rounded-lg hover:bg-accent transition-colors text-left shadow-sm w-full">
                <div className="font-medium text-foreground">Manage Players</div>
                <div className="text-sm text-muted-foreground mt-1">Update player profiles</div>
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Performers</CardTitle>
            <Trophy className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rankedPlayers.length > 0 ? (
                rankedPlayers.map((item, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-border last:border-0 pb-3 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center font-bold text-xs">
                        #{i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {item.player.firstName} {item.player.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.player.currentClub || 'Free Agent'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">{item.interestCount}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">Interests</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No ranked players data.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isBroadcastModalOpen} onOpenChange={setIsBroadcastModalOpen}>
        <DialogContent className="bg-popover">
          <DialogHeader>
            <DialogTitle>Send Global Announcement</DialogTitle>
            <DialogDescription>
              This will send a notification to ALL registered agents in the system.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleBroadcast} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Announcement Title</Label>
              <Input
                id="title"
                placeholder="Important: Site Maintenance"
                value={broadcastData.title}
                onChange={(e) => setBroadcastData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Write your announcement message here..."
                className="min-h-[120px]"
                value={broadcastData.message}
                onChange={(e) => setBroadcastData(prev => ({ ...prev, message: e.target.value }))}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1" disabled={sendingBroadcast}>
                {sendingBroadcast ? "Sending..." : "Broadcast to All"}
              </Button>
              <Button type="button" variant="outline" className="flex-1" onClick={() => setIsBroadcastModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;

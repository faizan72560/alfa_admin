import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCog, GitPullRequest, CheckCircle } from "lucide-react";

const stats = [
  {
    title: "Total Users",
    value: "248",
    icon: Users,
    description: "+12% from last month",
    color: "text-primary",
  },
  {
    title: "Active Players",
    value: "87",
    icon: UserCog,
    description: "+5 new this week",
    color: "text-success",
  },
  {
    title: "Pending Transfers",
    value: "23",
    icon: GitPullRequest,
    description: "Requires attention",
    color: "text-warning",
  },
  {
    title: "Completed Requests",
    value: "156",
    icon: CheckCircle,
    description: "This month",
    color: "text-success",
  },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's an overview of your admin panel.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
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

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { user: "John Doe", action: "registered as new agent", time: "2 hours ago" },
                { user: "Jane Smith", action: "submitted transfer request", time: "4 hours ago" },
                { user: "Mike Johnson", action: "updated player profile", time: "6 hours ago" },
                { user: "Sarah Williams", action: "completed verification", time: "1 day ago" },
              ].map((activity, i) => (
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
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <button className="px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors text-left shadow-sm">
                <div className="font-medium">Review Pending Agents</div>
                <div className="text-sm opacity-90 mt-1">5 requests waiting</div>
              </button>
              <button className="px-4 py-3 bg-card border border-border rounded-lg hover:bg-accent transition-colors text-left shadow-sm">
                <div className="font-medium text-foreground">Process Transfers</div>
                <div className="text-sm text-muted-foreground mt-1">23 pending approvals</div>
              </button>
              <button className="px-4 py-3 bg-card border border-border rounded-lg hover:bg-accent transition-colors text-left shadow-sm">
                <div className="font-medium text-foreground">Send Notifications</div>
                <div className="text-sm text-muted-foreground mt-1">Broadcast to agents</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

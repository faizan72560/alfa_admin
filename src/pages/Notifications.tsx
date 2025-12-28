import { useState, useEffect } from "react";
import { Send, Users, Mail, Bell, History, Search, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { sendNotification, broadcastNotification, getNotifications } from "@/services/notifications";

const Notifications = () => {
  const [audience, setAudience] = useState("All");
  const [channel, setChannel] = useState("in-app");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("compose");
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "history") {
      fetchHistory();
    }
  }, [activeTab]);

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const data = await getNotifications();
      setHistory(data);
    } catch (error) {
      toast.error("Failed to fetch notification history");
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSend = async () => {
    if (!subject.trim()) {
      toast.error("Please enter a subject/title");
      return;
    }
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setLoading(true);
    try {
      if (audience === "Broadcast") {
        await broadcastNotification({
          title: subject,
          message: message,
          type: 'Announcement'
        });
        toast.success("Broadcast sent to all agents!");
      } else {
        await sendNotification({
          audience: audience as any,
          channels: channel === 'all' ? ['in-app', 'email', 'push'] : [channel as any],
          subject,
          message
        });
        toast.success("Notification sent successfully!");
      }
      setMessage("");
      setSubject("");
    } catch (error: any) {
      toast.error(error.message || "Failed to send notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
        <p className="text-muted-foreground mt-1">Send targeted notifications and global announcements</p>
      </div>

      <div className="flex border-b border-border mb-6">
        <button
          className={`pb-4 px-6 text-sm font-medium transition-colors relative ${activeTab === 'compose' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('compose')}
        >
          Compose Notification
          {activeTab === 'compose' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
        </button>
        <button
          className={`pb-4 px-6 text-sm font-medium transition-colors relative ${activeTab === 'history' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('history')}
        >
          Sent History
          {activeTab === 'history' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
        </button>
      </div>

      {activeTab === 'compose' ? (
        <>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Total Recipients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">87</p>
                <p className="text-sm text-muted-foreground mt-1">Active agents</p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Mail className="h-5 w-5 text-success" />
                  Sent This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">234</p>
                <p className="text-sm text-muted-foreground mt-1">Notifications delivered</p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell className="h-5 w-5 text-amber-500" />
                  Open Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">92%</p>
                <p className="text-sm text-muted-foreground mt-1">Average engagement</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Compose Communication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="audience">Select Audience</Label>
                  <Select value={audience} onValueChange={setAudience}>
                    <SelectTrigger id="audience">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="Broadcast">Broadcast to All (Global)</SelectItem>
                      <SelectItem value="All">All Registered Entities</SelectItem>
                      <SelectItem value="Active">Active Agents Only</SelectItem>
                      <SelectItem value="Pending">Pending Review Agents</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="channel">Notification Channel</Label>
                  <Select value={channel} onValueChange={setChannel} disabled={audience === "Broadcast"}>
                    <SelectTrigger id="channel">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="in-app">In-App Notification</SelectItem>
                      <SelectItem value="email">Email Service</SelectItem>
                      <SelectItem value="push">Push (Mobile)</SelectItem>
                      <SelectItem value="all">Multiple Channels</SelectItem>
                    </SelectContent>
                  </Select>
                  {audience === "Broadcast" && <p className="text-[10px] text-muted-foreground italic mt-1">Broadcasts are sent via In-App by default.</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">{audience === "Broadcast" ? "Announcement Title" : "Subject"}</Label>
                <Input
                  id="subject"
                  placeholder={audience === "Broadcast" ? "e.g. System Update" : "Enter notification subject"}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message Body</Label>
                <Textarea
                  id="message"
                  placeholder="Type your message here..."
                  className="min-h-[200px]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSend}
                  className="bg-primary hover:bg-primary-hover text-primary-foreground min-w-[150px]"
                  disabled={loading}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {loading ? "Processing..." : (audience === "Broadcast" ? "Broadcast Now" : "Send Notification")}
                </Button>
                <Button variant="outline">Save as Template</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Quick Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                {[
                  { title: "Welcome Message", description: "For new agent approvals" },
                  { title: "Document Request", description: "Request missing documents" },
                  { title: "Status Update", description: "Notify about application progress" },
                  { title: "System Maintenance", description: "Announce scheduled downtime" },
                ].map((template, i) => (
                  <button
                    key={i}
                    className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left group"
                    onClick={() => {
                      setSubject(template.title);
                      setMessage(`Dear Agent,\n\nThis is a notification regarding: ${template.title}.\n\nPlease check your dashboard for more details.\n\nBest regards,\nAlfa Administration`);
                    }}
                  >
                    <div className="font-medium text-foreground group-hover:text-primary transition-colors">{template.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">{template.description}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Notification Logs</CardTitle>
            <Button variant="outline" size="sm" onClick={fetchHistory} disabled={historyLoading}>
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
                <Bell className="h-8 w-8 animate-pulse mb-4" />
                <p>Loading notification logs...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
                <Mail className="h-8 w-8 mb-4 opacity-20" />
                <p>No notifications sent yet.</p>
              </div>
            ) : (
              <div className="space-y-0">
                {history.map((notif, idx) => (
                  <div key={idx} className="group p-4 border-b border-border last:border-0 hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="mt-1 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          {notif.channels?.includes('email') ? <Mail className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{notif.subject}</h3>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${notif.audience === 'All' || notif.audience === 'Broadcast' ? 'bg-amber-500/10 text-amber-600' : 'bg-primary/10 text-primary'
                              }`}>
                              {notif.audience || 'Targeted'}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2 max-w-2xl">{notif.message}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Users className="h-3.5 w-3.5" />
                              {notif.recipientCount || 'N/A'} recipients
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Notifications;

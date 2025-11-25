import { useState } from "react";
import { Send, Users, Mail, Bell } from "lucide-react";
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

const Notifications = () => {
  const [audience, setAudience] = useState("all-agents");
  const [channel, setChannel] = useState("in-app");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    toast.success("Notification sent successfully!");
    setMessage("");
    setSubject("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
        <p className="text-muted-foreground mt-1">Send targeted notifications to users</p>
      </div>

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
              <Bell className="h-5 w-5 text-warning" />
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
          <CardTitle>Send Notification</CardTitle>
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
                  <SelectItem value="all-agents">All Agents</SelectItem>
                  <SelectItem value="all-members">All Members</SelectItem>
                  <SelectItem value="active-agents">Active Agents</SelectItem>
                  <SelectItem value="pending-agents">Pending Agents</SelectItem>
                  <SelectItem value="custom">Custom Group</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="channel">Notification Channel</Label>
              <Select value={channel} onValueChange={setChannel}>
                <SelectTrigger id="channel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="in-app">In-App Notification</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="push">Push Notification</SelectItem>
                  <SelectItem value="all">All Channels</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Enter notification subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
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
              className="bg-primary hover:bg-primary-hover text-primary-foreground"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Notification
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
          <div className="grid gap-3">
            {[
              { title: "Welcome Message", description: "For new agent approvals" },
              { title: "Document Request", description: "Request missing documents" },
              { title: "Status Update", description: "Notify about application progress" },
              { title: "System Maintenance", description: "Announce scheduled downtime" },
            ].map((template, i) => (
              <button
                key={i}
                className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left"
                onClick={() => {
                  setSubject(template.title);
                  setMessage(`This is a ${template.title.toLowerCase()} notification.`);
                }}
              >
                <div className="font-medium text-foreground">{template.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{template.description}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;

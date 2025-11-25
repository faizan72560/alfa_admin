import { Download, FileText, Users, GitPullRequest } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Export = () => {
  const handleExport = (type: string) => {
    toast.success(`${type} exported successfully!`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Export Data</h1>
        <p className="text-muted-foreground mt-1">Download reports and data exports</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              User Data Export
            </CardTitle>
            <CardDescription>
              Export all user information including agents and members
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Button
                onClick={() => handleExport("Users CSV")}
                className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button
                onClick={() => handleExport("Users Excel")}
                variant="outline"
                className="flex-1"
              >
                <FileText className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Includes: Name, Email, Role, Status, Registration Date
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitPullRequest className="h-5 w-5 text-success" />
              Transfer Requests
            </CardTitle>
            <CardDescription>
              Export all transfer request records and history
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Button
                onClick={() => handleExport("Transfers CSV")}
                className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button
                onClick={() => handleExport("Transfers Excel")}
                variant="outline"
                className="flex-1"
              >
                <FileText className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Includes: Player, Agent, Clubs, Status, Dates
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-warning" />
              Agent Performance
            </CardTitle>
            <CardDescription>
              Export agent activity and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Button
                onClick={() => handleExport("Agent Performance CSV")}
                className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button
                onClick={() => handleExport("Agent Performance Excel")}
                variant="outline"
                className="flex-1"
              >
                <FileText className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Includes: Agent Name, Total Players, Successful Transfers, Rating
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-destructive" />
              Full System Report
            </CardTitle>
            <CardDescription>
              Complete export of all system data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Button
                onClick={() => handleExport("Full Report CSV")}
                className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button
                onClick={() => handleExport("Full Report Excel")}
                variant="outline"
                className="flex-1"
              >
                <FileText className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Includes: All users, players, transfers, and system logs
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">Export Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>CSV files are suitable for importing into other systems and databases</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Excel files include formatting and are better for reports and analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>All exports include data up to the current date and time</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Sensitive information is automatically redacted in exports</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Export;

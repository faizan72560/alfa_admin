import { useState } from "react";
import { Download, FileText, Users, GitPullRequest } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Export = () => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleExport = async (type: string, format: 'csv' | 'excel') => {
    const endpoint = type === 'users' ? '/admin/export/users' : '/admin/export/transfers';
    const token = localStorage.getItem('accessToken');

    setLoading(`${type}-${format}`);
    try {
      const response = await fetch(`http://localhost:4000/api/v1${endpoint}?format=${format}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-${new Date().toISOString().split('T')[0]}.${format === 'csv' ? 'csv' : 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`${type} ${format} exported successfully!`);
    } catch (error) {
      console.error(error);
      toast.error(`Failed to export ${type}`);
    } finally {
      setLoading(null);
    }
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
                onClick={() => handleExport("users", "csv")}
                className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground"
                disabled={loading === "users-csv"}
              >
                <Download className="h-4 w-4 mr-2" />
                {loading === "users-csv" ? "Exporting..." : "Export CSV"}
              </Button>
              <Button
                onClick={() => handleExport("users", "excel")}
                variant="outline"
                className="flex-1"
                disabled={loading === "users-excel"}
              >
                <FileText className="h-4 w-4 mr-2" />
                {loading === "users-excel" ? "Exporting..." : "Export Excel"}
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
                onClick={() => handleExport("transfers", "csv")}
                className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground"
                disabled={loading === "transfers-csv"}
              >
                <Download className="h-4 w-4 mr-2" />
                {loading === "transfers-csv" ? "Exporting..." : "Export CSV"}
              </Button>
              <Button
                onClick={() => handleExport("transfers", "excel")}
                variant="outline"
                className="flex-1"
                disabled={loading === "transfers-excel"}
              >
                <FileText className="h-4 w-4 mr-2" />
                {loading === "transfers-excel" ? "Exporting..." : "Export Excel"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Includes: Player, Agent, Clubs, Status, Dates
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

import { useState, useEffect } from "react";
import { Search, MoreVertical, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/dialog";
import { getContacts, deleteContact, deleteAllContacts, Contact } from "@/services/contacts";
import { toast } from "sonner";

const Contacts = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const data = await getContacts();
            setContacts(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch contact requests");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this contact request?")) return;
        try {
            await deleteContact(id);
            toast.success("Contact request deleted");
            fetchContacts();
        } catch (error) {
            toast.error("Failed to delete contact request");
        }
    };

    const handleClearAll = async () => {
        if (!confirm("Are you sure you want to delete ALL contact requests? This action cannot be undone.")) return;
        try {
            await deleteAllContacts();
            toast.success("All contact requests cleared");
            fetchContacts();
        } catch (error) {
            toast.error("Failed to clear contact requests");
        }
    };

    const filteredContacts = contacts.filter((contact) => {
        const matchesSearch =
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.message.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString() + " " + new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Contact Requests</h1>
                    <p className="text-muted-foreground mt-1">View messages from the landing page contact form</p>
                </div>
            </div>

            <Card className="shadow-md">
                <div className="p-6 border-b border-border">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, email or message..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="text-destructive hover:bg-destructive/10 border-destructive/20"
                                onClick={handleClearAll}
                                disabled={contacts.length === 0}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Clear All
                            </Button>
                        </div>
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Region</TableHead>
                            <TableHead>Message Snippet</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-4">Loading contacts...</TableCell>
                            </TableRow>
                        ) : filteredContacts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-4">No contact requests found.</TableCell>
                            </TableRow>
                        ) : (
                            filteredContacts.map((contact) => (
                                <TableRow key={contact.id}>
                                    <TableCell className="text-sm">{formatDate(contact.createdAt)}</TableCell>
                                    <TableCell className="font-medium">{contact.name}</TableCell>
                                    <TableCell>{contact.email}</TableCell>
                                    <TableCell>{contact.phoneNumber || "N/A"}</TableCell>
                                    <TableCell>{contact.region || "N/A"}</TableCell>
                                    <TableCell className="max-w-xs truncate">{contact.message}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-popover">
                                                <DropdownMenuItem onClick={() => { setSelectedContact(contact); setIsDetailModalOpen(true); }}>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Full Message
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(contact.id)}>
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
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
                        Showing {filteredContacts.length} requests
                    </p>
                </div>
            </Card>

            <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                <DialogContent className="max-w-2xl bg-popover">
                    <DialogHeader>
                        <DialogTitle>Contact Message Details</DialogTitle>
                        <DialogDescription>
                            Received on {selectedContact && formatDate(selectedContact.createdAt)}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedContact && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground uppercase">From</label>
                                    <p className="font-medium">{selectedContact.name}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground uppercase">Email</label>
                                    <p className="font-medium text-primary">{selectedContact.email}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground uppercase">Phone</label>
                                    <p className="font-medium">{selectedContact.phoneNumber || "N/A"}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground uppercase">Region</label>
                                    <p className="font-medium">{selectedContact.region || "N/A"}</p>
                                </div>
                            </div>
                            <div className="pt-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">Message</label>
                                <div className="mt-1 p-4 bg-muted rounded-lg whitespace-pre-wrap text-sm border border-border">
                                    {selectedContact.message}
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button onClick={() => setIsDetailModalOpen(false)}>Close</Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Contacts;

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { MapPin, Plus, Search } from "lucide-react";
import { useClients, type Client } from "@/hooks/useClients";

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { clients, isLoading, createClient, updateClient, deleteClient } = useClients();

  useEffect(() => {
    document.title = "Clients | GrowLoop Garden CRM";
  }, []);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Add form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [needs, setNeeds] = useState("");
  const [availability, setAvailability] = useState("");

  // Edit form state
  const [eFirstName, setEFirstName] = useState("");
  const [eLastName, setELastName] = useState("");
  const [eAddress, setEAddress] = useState("");
  const [ePostcode, setEPostcode] = useState("");
  const [eEmail, setEEmail] = useState("");
  const [ePhone, setEPhone] = useState("");
  const [eNeeds, setENeeds] = useState("");
  const [eAvailability, setEAvailability] = useState("");

  const composeNotes = (pc: string, n: string, av: string) => {
    const parts: string[] = [];
    if (pc) parts.push(`Postcode: ${pc}`);
    if (n) parts.push(`Needs: ${n}`);
    if (av) parts.push(`Availability: ${av}`);
    return parts.join("\n");
  };

  const parseNotes = (notes?: string) => {
    const result = { postcode: "", needs: "", availability: "" };
    if (!notes) return result;
    notes.split("\n").forEach(line => {
      const [key, ...rest] = line.split(":");
      const value = rest.join(":").trim();
      if (/postcode/i.test(key)) result.postcode = value;
      else if (/needs/i.test(key)) result.needs = value;
      else if (/availability/i.test(key)) result.availability = value;
    });
    if (!result.needs && notes && !/Needs:/i.test(notes)) {
      result.needs = notes; // fallback if previous format
    }
    return result;
  };

  const openAddDialog = () => {
    setFirstName("");
    setLastName("");
    setAddress("");
    setPostcode("");
    setEmail("");
    setPhone("");
    setNeeds("");
    setAvailability("");
    setIsAddOpen(true);
  };

  const openEditDialog = (client: Client) => {
    setEditingClient(client);
    const [fn, ...lnRest] = (client.name || "").split(" ");
    setEFirstName(fn || "");
    setELastName(lnRest.join(" ") || "");
    setEAddress(client.address || "");
    setEEmail(client.email || "");
    setEPhone(client.phone || "");
    const parsed = parseNotes(client.notes);
    setEPostcode(parsed.postcode);
    setENeeds(parsed.needs);
    setEAvailability(parsed.availability);
    setIsEditOpen(true);
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const needsSummary = (notes?: string) => {
    const { needs } = parseNotes(notes);
    const text = needs || notes || "";
    return text.length > 140 ? text.slice(0, 140) + "…" : text;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = [firstName, lastName].filter(Boolean).join(" ").trim();
    try {
      await createClient.mutateAsync({
        name,
        address,
        email,
        phone,
        status: "active",
        notes: composeNotes(postcode, needs, availability),
      } as any);
      setIsAddOpen(false);
    } catch (err) {}
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;
    const name = [eFirstName, eLastName].filter(Boolean).join(" ").trim();
    try {
      await updateClient.mutateAsync({
        id: editingClient.id,
        name,
        address: eAddress,
        email: eEmail,
        phone: ePhone,
        notes: composeNotes(ePostcode, eNeeds, eAvailability),
      } as any);
      setIsEditOpen(false);
      setEditingClient(null);
    } catch (err) {}
  };

  const confirmDelete = async (id: string) => {
    try {
      await deleteClient.mutateAsync(id);
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-foreground">Clients</h2>
          <p className="text-muted-foreground">Manage your garden client profiles</p>
        </div>
<Button onClick={openAddDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Client</DialogTitle>
            <DialogDescription>Enter client information to create a profile.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">First name</label>
                <Input value={firstName} onChange={e => setFirstName(e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-medium">Last name</label>
                <Input value={lastName} onChange={e => setLastName(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Address</label>
              <Input value={address} onChange={e => setAddress(e.target.value)} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Postcode</label>
                <Input value={postcode} onChange={e => setPostcode(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Phone number</label>
                <Input value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Description of client needs</label>
              <Textarea value={needs} onChange={e => setNeeds(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Times available for visiting</label>
              <Input value={availability} onChange={e => setAvailability(e.target.value)} placeholder="e.g. Weekdays 9–12" />
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createClient.isPending}>Create client</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={(open) => { setIsEditOpen(open); if (!open) setEditingClient(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>Update the client information.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">First name</label>
                <Input value={eFirstName} onChange={e => setEFirstName(e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-medium">Last name</label>
                <Input value={eLastName} onChange={e => setELastName(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Address</label>
              <Input value={eAddress} onChange={e => setEAddress(e.target.value)} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Postcode</label>
                <Input value={ePostcode} onChange={e => setEPostcode(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Phone number</label>
                <Input value={ePhone} onChange={e => setEPhone(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input type="email" value={eEmail} onChange={e => setEEmail(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Description of client needs</label>
              <Textarea value={eNeeds} onChange={e => setENeeds(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Times available for visiting</label>
              <Input value={eAvailability} onChange={e => setEAvailability(e.target.value)} />
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={updateClient.isPending}>Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Clients Grid */}
      <div className="max-h-[70vh] overflow-y-auto pr-1">
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
          {filteredClients.map((client) => (
            <Card key={client.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {client.address}
                    </CardDescription>
                  </div>
                  <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                    {client.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {needsSummary(client.notes) || "No needs specified yet."}
                    </p>
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditDialog(client)}>
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete client?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete {client.name}'s record.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => confirmDelete(client.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No clients found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default Clients;
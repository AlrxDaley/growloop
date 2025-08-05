import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Calendar, Plus, Search } from "lucide-react";
import { useClients } from "@/hooks/useClients";

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { clients, isLoading } = useClients();

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Button>
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

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Mail className="w-3 h-3 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">{client.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="w-3 h-3 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">{client.phone}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex justify-between text-sm">
                  <span><strong>{client.zones?.length || 0}</strong> zones</span>
                  {client.last_visit && (
                    <span className="text-muted-foreground">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      Last visit: {new Date(client.last_visit).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {/* Notes */}
                {client.notes && (
                  <p className="text-sm text-muted-foreground italic border-l-2 border-primary/20 pl-3">
                    {client.notes}
                  </p>
                )}

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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
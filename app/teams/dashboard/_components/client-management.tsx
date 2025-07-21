"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DatabaseConnection } from "@/app/teams/dashboard/_components/database-connection"
import { Plus, Database, FileText, Edit } from "lucide-react"
import { toast } from "sonner"
import { getClientsForOrg, insertClient, updateClientDetails, updateClientStatus } from "../_service/client_service"
import ClientFieldsConfig from "@/app/teams/dashboard/_components/client-invoice-config"

interface Client {
  id: string
  user_id: string
  org_id: string
  client_id: string
  client_name: string
  client_email: string
  status: "Active" | "inActive"
  dbConnection?: string
}

interface ClientManagementProps {
  orgName: string,
  orgID: string,
  user_id: string 
}


interface StatusToggleProps {
  status: "Active" | "inActive"
  clientId: string
  statusLoading: string | null
  onToggle: (id: string, currentStatus: "Active" | "inActive") => Promise<void>
}

function StatusToggle({ status, clientId, statusLoading, onToggle }: StatusToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={
          status === "Active"
            ? "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
            : "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
        }
      >
        {status}
      </span>

      <Button
        size="sm"
        variant="ghost"
        disabled={statusLoading === clientId}
        className={
          status === "Active"
            ? "text-red-500 hover:bg-red-50"
            : "text-green-500 hover:bg-green-50"
        }
        onClick={() => onToggle(clientId, status)}
      >
        {statusLoading === clientId
          ? "…"
          : status === "Active"
          ? "Deactivate"
          : "Activate"}
      </Button>
    </div>
  )
}

export function ClientManagement({ orgName, orgID, user_id }: ClientManagementProps) {
  const [clients, setClients] = useState<Client[]>([
    // { id: "1", name: "Acme Corp", email: "contact@acme.com", status: "active", credits: 500, dbConnection: "Zoho" },
    // { id: "2", name: "TechStart Inc", email: "hello@techstart.com", status: "active", credits: 250 },
    // {
    //   id: "3",
    //   name: "Global Solutions",
    //   email: "info@global.com",
    //   status: "inactive",
    //   credits: 0,
    //   dbConnection: "MySQL",
    // },
  ])

  const [newClientName, setNewClientName] = useState("")
  const [newClientEmail, setNewClientEmail] = useState("")
  // const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  // const [configDialog, setConfigDialog] = useState<"invoice" | "database" | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [statusLoading, setStatusLoading] = useState<string | null>(null)
  const [editClient, setEditClient] = useState<Client | null>(null)
  const [clientNameEdit, setClientNameEdit] = useState("")
  const [clientEmailEdit, setClientEmailEdit] = useState("")

  useEffect(() => {
    if (isLoading) return;
    if (!orgID) return;
  
    const fetchClients = async () => {
      setIsLoading(true)
      try {
        const clients = await getClientsForOrg(orgID)
        const byClientId = new Map<string, Client>();
        clients.forEach((c) => {
        // this will keep the *last* occurrence for each client_id;
        // reverse `all` first if you want the *first*.
        byClientId.set(c.client_id!, c);
        });
        const uniqueClients = Array.from(byClientId.values());
        setClients(uniqueClients);
      } catch (error) {
        toast.error("Failed to load clients: " + (error as Error).message)
      } finally {
        setIsLoading(false)
      }
    }
  
    fetchClients()
  }, [orgID])


  const addClient = async () => {
    if (!newClientName || !newClientEmail) {
      toast.error("Please provide both a client name and an email.");
      return;
    }

    try {
      const newClient = await insertClient(orgID, user_id, newClientName, newClientEmail);
      setClients([...clients, newClient]);
      setNewClientName("");
      setNewClientEmail("");
      toast.success("Client added successfully!");
    } catch (error) {
      toast.error("Failed to add client: " + (error as Error).message);
    }


  }

  const handleToggleStatus = useCallback(
    async (clientId: string, currentStatus: "Active" | "inActive") => {
      const nextStatus = currentStatus === "Active" ? "inActive" : "Active"
      // console.log(clientId)
      setStatusLoading(clientId)
      try {
        await updateClientStatus(clientId, nextStatus)
        setClients((all) =>
          all.map((c) => (c.client_id === clientId ? { ...c, status: nextStatus } : c))
        )
        toast.success(`Status set to ${nextStatus}`)
      } catch (err) {
        toast.error("Could not update status: " + (err as Error).message)
      } finally {
        setStatusLoading(null)
      }
    },
    []
  )

  // Open edit dialog
  const openEditClient = (client: Client) => {
    setEditClient(client)
    setClientNameEdit(client.client_name)
    setClientEmailEdit(client.client_email)
  }

  // Save client details
  const saveClientDetails = async () => {
    if (!editClient) return
    try {
      await updateClientDetails(editClient.id, clientNameEdit, clientEmailEdit)
      setClients((cs) => cs.map((c) => c.id === editClient.id
        ? { ...c, client_name: clientNameEdit, client_email: clientEmailEdit }
        : c))
      setEditClient(null)
      toast.success("Client details updated")
    } catch(e) {
      toast.error((e as Error).message)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Client Management</CardTitle>
          <CardDescription>Manage clients for organization: {orgName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="client-name">Client Name</Label>
              <Input
                id="client-name"
                placeholder="Enter client name"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="client-email">Client Email</Label>
              <Input
                id="client-email"
                type="email"
                placeholder="Enter client email"
                value={newClientEmail}
                onChange={(e) => setNewClientEmail(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={addClient}>
                <Plus className="h-4 w-4 mr-2" />
                Add Client
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>DB Connection</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {isLoading ? (
      // a single row spanning all columns with a loading indicator
      <TableRow>
        <TableCell colSpan={6} className="text-center py-8">
          Loading clients…
        </TableCell>
      </TableRow>
        ) : clients.length === 0 ? (
      // empty state
        <TableRow>
          <TableCell colSpan={6} className="text-center py-8">
            No clients found.
          </TableCell>
        </TableRow>
        ) : clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.client_name}</TableCell>
                  <TableCell>{client.client_email}</TableCell>
                  <TableCell>
                  <StatusToggle
                        status={client.status}
                        clientId={client.client_id}
                        statusLoading={statusLoading}
                        onToggle={handleToggleStatus}
                      />
                  </TableCell>
                  <TableCell>
                    {client.dbConnection ? (
                      <Badge variant="outline">{client.dbConnection}</Badge>
                    ) : (
                      <span className="text-muted-foreground">Not configured</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => openEditClient(client)}><Edit/></Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            // onClick={() => {
                            //   setSelectedClient(client)
                            //   setConfigDialog("invoice")
                            // }}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[80vh] overflow-y-auto">  {/* full‑bleed in the cell */}
                            <DialogHeader>
                            <DialogTitle>Invoice Configuration – {client.client_name}</DialogTitle>
                            <DialogDescription>
                                    Configure invoice fields and templates for this client
                            </DialogDescription>
                            </DialogHeader>

                                  {/* swap in your full screen FieldsConfig card here */}
                              <ClientFieldsConfig client={client} role="manager" />

                            </DialogContent>
                    </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            // onClick={() => {
                            //   setSelectedClient(client)
                            //   setConfigDialog("database")
                            // }}
                          >
                            <Database className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Database Connection - {client.client_name}</DialogTitle>
                            <DialogDescription>Configure database connection for this client</DialogDescription>
                          </DialogHeader>
                          <DatabaseConnection client={client} />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Edit client dialog */}
      <Dialog open={!!editClient} onOpenChange={() => setEditClient(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>Update client name/email</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label>Name</Label>
              <Input value={clientNameEdit} onChange={e => setClientNameEdit(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label>Email</Label>
              <Input value={clientEmailEdit} onChange={e => setClientEmailEdit(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditClient(null)}>Cancel</Button>
            <Button onClick={saveClientDetails}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

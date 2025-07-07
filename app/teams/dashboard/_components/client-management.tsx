"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ClientInvoiceConfig } from "@/app/teams/dashboard/_components/client-invoice-config"
import { DatabaseConnection } from "@/app/teams/dashboard/_components/database-connection"
import { Plus, Database, FileText } from "lucide-react"
import { toast } from "sonner"
import { getClientsForOrg } from "../_service/client_service"

interface Client {
  id: string
  user_id: string
  org_id: string
  client_name: string
  client_email: string
  status: "Active" | "inActive"
  credits: number
  dbConnection?: string
}

interface ClientManagementProps {
  orgName: string,
  orgID: string 
}

export function ClientManagement({ orgName, orgID }: ClientManagementProps) {
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
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [configDialog, setConfigDialog] = useState<"invoice" | "database" | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isLoading) return;
    if (!orgID) return;
  
    const fetchClients = async () => {
      setIsLoading(true)
      try {
        const clients = await getClientsForOrg(orgID)
        setClients(clients)
      } catch (error) {
        toast.error("Failed to load clients: " + (error as Error).message)
      } finally {
        setIsLoading(false)
      }
    }
  
    fetchClients()
  }, [orgID])


  const addClient = () => {
    if (!newClientName || !newClientEmail) return


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
                <TableHead>Credits</TableHead>
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
                    <Badge variant={client.status === "inActive" ? "default" : "secondary"}>{client.status}</Badge>
                  </TableCell>
                  <TableCell>{client.credits}</TableCell>
                  <TableCell>
                    {client.dbConnection ? (
                      <Badge variant="outline">{client.dbConnection}</Badge>
                    ) : (
                      <span className="text-muted-foreground">Not configured</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedClient(client)
                              setConfigDialog("invoice")
                            }}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Invoice Configuration - {client.client_name}</DialogTitle>
                            <DialogDescription>
                              Configure invoice fields and templates for this client
                            </DialogDescription>
                          </DialogHeader>
                          <ClientInvoiceConfig client={client} />
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedClient(client)
                              setConfigDialog("database")
                            }}
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
    </div>
  )
}

"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CreditCard, Plus, Send, TrendingUp, Users, Trash, Check } from "lucide-react"
import { getUsersForOrg, assignClientToUser, unassignClientFromUser, ClientLink, allocateCreditsToUser } from "../_service/credit_management_servise"
import { getClientsForOrg} from "../_service/client_service"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"

interface User {
  id: string
  name: string
  email: string
  credits: number
  role: string
  client_names: string[]
  uploads_used: number
}

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

interface CreditManagementProps {
  orgId: string
  profile: Profile
}

export function CreditManagement({ orgId , profile }: CreditManagementProps) {
  const [users, setUsers] = useState<User[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [draftCredits, setDraftCredits] = useState<string>("")
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedClient, setSelectedClient] = useState("")
  const [creditAmount, setCreditAmount] = useState("")
  const totalCredits = profile?.subscription_tier === "Teams" && profile.org_id === orgId
  ? profile.uploads_limit
  : 0
  const roleUsers = users.filter((u) => u.role === "user")

  
  useEffect(() => {
    if (profile?.subscription_tier === "Teams" && profile.org_id === orgId) {
      setLoadingUsers(true);
  
      getUsersForOrg(orgId)
        .then((rows) => {
          const mapped: User[] = rows.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            credits: u.uploads_limit,
            role: u.role,
            client_names: u.client_names,
            uploads_used: u.uploads_used,
          }))
          setUsers(mapped)
  
          // return the next promise so that .catch/.finally will see errors here too
          return getClientsForOrg(orgId);
        })
        .then((rows) => {
          const clients: Client[] = rows.map((u) => ({
            id: u.id,
            user_id: u.user_id,
            org_id: u.org_id,
            client_id: u.client_id,
            client_name: u.client_name,
            client_email: u.client_email,
            status: u.status,
            dbConnection: u.dbConnection,
          }));
          setClients(clients);
        })
        .catch((e: Error) => {
          toast.error(e.message);
        })
        .finally(() => {
          setLoadingUsers(false);
        });
    }
  }, [orgId, profile]);
  
  const uniqueClients = useMemo(() => {
    const seen = new Set<string>();
    return clients
      .filter(c => c.status === "Active")    // ← only Active
      .filter((c) => {
        if (seen.has(c.client_name)) return false;
        seen.add(c.client_name);
        return true;
      });
  }, [clients]);


  const getTotalAllocated = () => {
    return roleUsers.reduce((total, user) => total + user.credits, 0)
  }

  const getTotalUsed = () => {
    return users.reduce((total, user) => total + user.uploads_used, 0)
  }

  const remainingCredits = totalCredits - getTotalUsed() - getTotalAllocated(); 

  const allocateCredits = async () => {
    if (!selectedUser || !creditAmount || !selectedClient) return
    const user = users.find(u => u.id === selectedUser);
    const client = clients.find(c => c.client_id === selectedClient);
    if (!user ) return toast.error("User not found");
    if (!client || client.status !== "Active") {
      return toast.error("client is not active.");
    }
    if (user.client_names.includes(client.client_name)) {
      return toast.error(`${client.client_name} is already assigned to ${user.name}`);
    }

    const amount = Number.parseInt(creditAmount)
    if (amount > remainingCredits) return toast.error(`you have ${remainingCredits} credits left to allocate`);
    if (amount < 0) {
      return toast.error("Please enter an amount of at least 1 credit");
    }
    // const client = uniqueClients.find(c => c.client_id === selectedClient);
    // if (!client) return toast.error("Client not found");
    await assignClientToUser(
      selectedUser,
      orgId,
      {
        client_id:    client.client_id,
        client_name:  client.client_name,
        client_email: client.client_email,
        dbConnection: client.dbConnection ?? "excel",
        status:       client.status,
      }
    )

    await allocateCreditsToUser(selectedUser, orgId, amount)

    setSelectedUser("")
    setSelectedClient("")
    setCreditAmount("")
  }

  

  const handleDelete = () => {
    toast("Delete option is not available")
  }

  const handleToggleClient = async (
    userId: string,
    client: Client,
    alreadyAssigned: boolean
    ) => {
    const clientId = client.client_id
    // console.log("handleToggleClient", userId, clientId, alreadyAssigned)
    try {
    if (alreadyAssigned) {
    await unassignClientFromUser(userId, orgId, client)
    } else {
    await assignClientToUser(userId, orgId, client)
    }
    setUsers(prev =>
      prev.map(u =>
        u.id !== userId
          ? u
          : {
              ...u,
              clientIds: alreadyAssigned
                ? u.client_names.filter(id => id !== clientId)
                : [...u.client_names, clientId],
              client_names: alreadyAssigned
                ? u.client_names.filter(n => n !== clients.find(c => c.id === clientId)?.client_name)
                : [...u.client_names, clients.find(c => c.id === clientId)?.client_name || ""]
            }
      )
    )
    toast.success(
      `${alreadyAssigned ? "Removed" : "Assigned"} client successfully`
    )
    } catch (e: any) {
    toast.error(e.message)
    }
    }
  

  const updateUserCredits = async (userId: string, newCredits: number) => {
    try {
      // 1) Compute sum of credits excluding the one we’re editing
      const otherAllocated = roleUsers
        .filter(u => u.id !== userId)
        .reduce((sum, u) => sum + u.credits, 0);
  
      // 2) If otherAllocated + newCredits exceeds total
      if (getTotalUsed() + otherAllocated  + newCredits > totalCredits) {
        return toast.error(
          `you have ${remainingCredits} credits remaining. You cannot allocate ${newCredits} to this user.`
        );
      }
  
      // 3) Disallow negative or zero
      if (newCredits < 0) {
        return toast.error("Please enter at least 1 credit");
      }
  
      // 4) Persist to Supabase
      await allocateCreditsToUser(userId, orgId, newCredits);
  
      // 5) Update local state
      setUsers(prev =>
        prev.map(u => (u.id === userId ? { ...u, credits: newCredits } : u))
      );
  
      toast.success("Credits updated");
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message);
      }
    }
  }

  // console.log(clients.client_name)
  return (
    <div className="space-y-6">
      {/* Credit Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCredits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Available credits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Allocated</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalAllocated().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">To users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Used</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalUsed().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">By users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">With credits</p>
          </CardContent>
        </Card>
      </div>

      {/* Credit Allocation */}
      <Card>
        <CardHeader>
          <CardTitle>Allocate Credits</CardTitle>
          <CardDescription>Distribute credits to users in your organization & assign clients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="user-select">Select User</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor="user-select">Assign Client</Label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a client" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueClients.map((clients) => (
                    <SelectItem key={clients.client_id} value={clients.client_id}>
                      {clients.client_name} 
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor="credit-amount">Credit Amount</Label>
              <Input
                id="credit-amount"
                type="number"
                placeholder="Enter amount"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                  You have {remainingCredits.toLocaleString()} credits left to allocate
              </p>
            </div>
            <div className="flex items-end">
              <Button onClick={allocateCredits}>
                <Plus className="h-4 w-4 mr-2" />
                Allocate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Credit Status */}
      <Card>
        <CardHeader>
          <CardTitle>User Credit Status</CardTitle>
          <CardDescription>Monitor credit usage across all users</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Clients</TableHead>
                <TableHead>Available Credits</TableHead>
                <TableHead>Used Credits</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Status</TableHead>
                {/* <TableHead>Delete</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const usagePercentage =
                  user.credits > 0 ? (user.uploads_used / (user.credits + user.uploads_used)) * 100 : 0
                const isLowCredits = user.credits < 50
                const isEditing = editingUserId === user.id

                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                    <Popover> 
                      <PopoverTrigger asChild> 
                      <Button variant="ghost" size="sm"> 
                        {user.client_names.length ? user.client_names.join(" | ") : "No Clients"} 
                      </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-56">
  <Command>
    <CommandGroup>
    {uniqueClients.map((c) => {
    const checked = user.client_names.includes(c.client_name);

    return (
      <CommandItem
        key={c.client_id}
        onSelect={() => handleToggleClient(user.id, c, checked)}
        className="flex items-center justify-between"
      >
        <div className="flex items-center">
          {checked && <Check className="mr-2 h-3 w-3 text-green-600" />}
          {c.client_name}
        </div>
        <div className="text-sm text-muted-foreground">
          {checked ? "Remove" : "Add"}
        </div>
      </CommandItem>
    );
  })}
    </CommandGroup>
  </Command>
</PopoverContent>
</Popover>
  
                    </TableCell>
                    <TableCell className="font-medium">
                    {isEditing ? (
                  <Input
                    type="number"
                    value={draftCredits}
                    min={0}
                    onChange={(e) => setDraftCredits(e.target.value)}
                    onBlur={() => {
                      const parsed = parseInt(draftCredits, 10)
                      if (!isNaN(parsed) && parsed >= 0) {
                        updateUserCredits(user.id, parsed)
                      }
                      setEditingUserId(null)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        (e.target as HTMLInputElement).blur()
                      } else if (e.key === "Escape") {
                        setEditingUserId(null)
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <div
                    onDoubleClick={() => {
                      setEditingUserId(user.id)
                      setDraftCredits(user.credits.toString())
                    }}
                    className="cursor-pointer"
                    title="Double‑click to edit"
                  >
                    {user.credits}
                  </div>
                )}
                    </TableCell>
                    <TableCell>{user.uploads_used}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Progress value={usagePercentage} className="h-2" />
                        <div className="text-xs text-muted-foreground">{usagePercentage.toFixed(1)}% used</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={isLowCredits ? "destructive" : "default"}>
                        {isLowCredits ? "Low Credits" : "Active"}
                      </Badge>
                    </TableCell>
                    {/* <TableCell className="flex items-center space-x-2">

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete}
                        aria-label="Delete user"
                    >
                      
                    <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                    </TableCell> */}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Transactions
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest credit allocation and usage history</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.slice(0, 10).map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.userName}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.type === "allocated"
                          ? "default"
                          : transaction.type === "used"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell className={transaction.amount > 0 ? "text-green-600" : "text-red-600"}>
                    {transaction.amount > 0 ? "+" : ""}
                    {transaction.amount}
                  </TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card> */}
    </div>
  )
}

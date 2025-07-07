"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CreditCard, Plus, Send, TrendingUp, Users } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  credits: number
  usedCredits: number
  role: string
}

interface CreditTransaction {
  id: string
  userId: string
  userName: string
  amount: number
  type: "allocated" | "used" | "refunded"
  date: string
  description: string
}

interface CreditManagementProps {
  orgId: string
}

export function CreditManagement({ orgId }: CreditManagementProps) {
  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "John Doe", email: "john@example.com", credits: 500, usedCredits: 150, role: "Admin" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", credits: 300, usedCredits: 75, role: "User" },
    { id: "3", name: "Bob Johnson", email: "bob@example.com", credits: 200, usedCredits: 200, role: "User" },
  ])

  const [transactions, setTransactions] = useState<CreditTransaction[]>([
    {
      id: "1",
      userId: "1",
      userName: "John Doe",
      amount: 100,
      type: "allocated",
      date: "2024-01-15",
      description: "Monthly allocation",
    },
    {
      id: "2",
      userId: "2",
      userName: "Jane Smith",
      amount: -25,
      type: "used",
      date: "2024-01-14",
      description: "API usage",
    },
    {
      id: "3",
      userId: "1",
      userName: "John Doe",
      amount: -50,
      type: "used",
      date: "2024-01-13",
      description: "Report generation",
    },
  ])

  const [selectedUser, setSelectedUser] = useState("")
  const [creditAmount, setCreditAmount] = useState("")
  const [totalCredits] = useState(2350)

  const allocateCredits = () => {
    if (!selectedUser || !creditAmount) return

    const amount = Number.parseInt(creditAmount)
    setUsers(users.map((user) => (user.id === selectedUser ? { ...user, credits: user.credits + amount } : user)))

    const user = users.find((u) => u.id === selectedUser)
    if (user) {
      const newTransaction: CreditTransaction = {
        id: Date.now().toString(),
        userId: selectedUser,
        userName: user.name,
        amount: amount,
        type: "allocated",
        date: new Date().toISOString().split("T")[0],
        description: "Manual allocation",
      }
      setTransactions([newTransaction, ...transactions])
    }

    setSelectedUser("")
    setCreditAmount("")
  }

  const getTotalAllocated = () => {
    return users.reduce((total, user) => total + user.credits, 0)
  }

  const getTotalUsed = () => {
    return users.reduce((total, user) => total + user.usedCredits, 0)
  }

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
          <CardDescription>Distribute credits to users in your organization</CardDescription>
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
              <Label htmlFor="credit-amount">Credit Amount</Label>
              <Input
                id="credit-amount"
                type="number"
                placeholder="Enter amount"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
              />
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
                <TableHead>Available Credits</TableHead>
                <TableHead>Used Credits</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const usagePercentage =
                  user.credits > 0 ? (user.usedCredits / (user.credits + user.usedCredits)) * 100 : 0
                const isLowCredits = user.credits < 50

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
                    <TableCell className="font-medium">{user.credits}</TableCell>
                    <TableCell>{user.usedCredits}</TableCell>
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
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
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
      </Card>
    </div>
  )
}

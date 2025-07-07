"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Database, TestTube } from "lucide-react"

interface DatabaseConnectionProps {
  client: any
}

export function DatabaseConnection({ client }: DatabaseConnectionProps) {
  const [connectionType, setConnectionType] = useState("zoho")
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [config, setConfig] = useState({
    host: "",
    port: "",
    database: "",
    username: "",
    password: "",
    apiKey: "",
    apiSecret: "",
    connectionString: "",
  })

  const testConnection = async () => {
    setConnectionStatus("testing")
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setConnectionStatus(Math.random() > 0.3 ? "success" : "error")
  }

  const saveConnection = () => {
    // Save connection logic here
    console.log("Saving connection for client:", client.name)
  }

  const renderConnectionForm = () => {
    switch (connectionType) {
      case "zoho":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter Zoho API key"
                value={config.apiKey}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-secret">API Secret</Label>
              <Input
                id="api-secret"
                type="password"
                placeholder="Enter Zoho API secret"
                value={config.apiSecret}
                onChange={(e) => setConfig({ ...config, apiSecret: e.target.value })}
              />
            </div>
          </div>
        )

      case "mysql":
      case "postgresql":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="host">Host</Label>
                <Input
                  id="host"
                  placeholder="localhost"
                  value={config.host}
                  onChange={(e) => setConfig({ ...config, host: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="port">Port</Label>
                <Input
                  id="port"
                  placeholder={connectionType === "mysql" ? "3306" : "5432"}
                  value={config.port}
                  onChange={(e) => setConfig({ ...config, port: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="database">Database Name</Label>
              <Input
                id="database"
                placeholder="Enter database name"
                value={config.database}
                onChange={(e) => setConfig({ ...config, database: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter username"
                  value={config.username}
                  onChange={(e) => setConfig({ ...config, username: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={config.password}
                  onChange={(e) => setConfig({ ...config, password: e.target.value })}
                />
              </div>
            </div>
          </div>
        )

      case "mongodb":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="connection-string">Connection String</Label>
              <Textarea
                id="connection-string"
                placeholder="mongodb://username:password@host:port/database"
                value={config.connectionString}
                onChange={(e) => setConfig({ ...config, connectionString: e.target.value })}
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Connection
          </CardTitle>
          <CardDescription>Configure database connection for {client.name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="connection-type">Connection Type</Label>
            <Select value={connectionType} onValueChange={setConnectionType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zoho">Zoho CRM</SelectItem>
                <SelectItem value="mysql">MySQL</SelectItem>
                <SelectItem value="postgresql">PostgreSQL</SelectItem>
                <SelectItem value="mongodb">MongoDB</SelectItem>
                <SelectItem value="sqlite">SQLite</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {renderConnectionForm()}

          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={testConnection} disabled={connectionStatus === "testing"}>
              <TestTube className="h-4 w-4 mr-2" />
              {connectionStatus === "testing" ? "Testing..." : "Test Connection"}
            </Button>

            {connectionStatus === "success" && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Connection successful</span>
              </div>
            )}

            {connectionStatus === "error" && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">Connection failed</span>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={saveConnection}>Save Connection</Button>
          </div>
        </CardContent>
      </Card>

      {client.dbConnection && (
        <Card>
          <CardHeader>
            <CardTitle>Current Connection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Connected to: {client.dbConnection}</p>
                <p className="text-sm text-muted-foreground">Last updated: 2 hours ago</p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type LogEntry = {
  id: string
  timestamp: string
  level: string
  message: string
  metadata: any
}

export function LogsTable() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [])

  async function fetchLogs() {
    try {
      setLoading(true)
      // In a real app, you would fetch this data from Supabase logs
      // This is a simulation for demonstration purposes

      const mockLogs = [
        {
          id: "1",
          timestamp: "2023-12-15T10:30:00Z",
          level: "info",
          message: "User profile updated successfully",
          metadata: { user_id: "user123", action: "profile_update" },
        },
        {
          id: "2",
          timestamp: "2023-12-15T10:25:00Z",
          level: "error",
          message: "Failed to process invoice document",
          metadata: { document_id: "doc456", error: "Invalid format" },
        },
        {
          id: "3",
          timestamp: "2023-12-15T10:20:00Z",
          level: "warning",
          message: "High token usage detected",
          metadata: { user_id: "user789", tokens: 5000 },
        },
        {
          id: "4",
          timestamp: "2023-12-15T10:15:00Z",
          level: "info",
          message: "New user registration",
          metadata: { user_id: "user101", email: "newuser@example.com" },
        },
        {
          id: "5",
          timestamp: "2023-12-15T10:10:00Z",
          level: "error",
          message: "Database connection timeout",
          metadata: { connection_id: "conn123", timeout: "30s" },
        },
      ]

      setLogs(mockLogs)
    } catch (error) {
      console.error("Error fetching logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const getLevelBadgeVariant = (level: string) => {
    switch (level) {
      case "error":
        return "destructive"
      case "warning":
        return "secondary"
      case "info":
        return "default"
      default:
        return "outline"
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Metadata</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                Loading logs...
              </TableCell>
            </TableRow>
          ) : logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No logs found.
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-sm">{formatTimestamp(log.timestamp)}</TableCell>
                <TableCell>
                  <Badge variant={getLevelBadgeVariant(log.level)}>{log.level.toUpperCase()}</Badge>
                </TableCell>
                <TableCell>{log.message}</TableCell>
                <TableCell className="font-mono text-xs">{JSON.stringify(log.metadata)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

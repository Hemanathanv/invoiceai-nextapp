"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Campaign = {
  name: string
  percentage: number
  icon: string
}

export function DashboardCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        // In a real app, you would fetch this data from Google Analytics
        // This is a simulation for demonstration purposes

        // Simulate campaign data
        const mockCampaigns = [
          { name: "Facebook", percentage: 55, icon: "facebook" },
          { name: "LinkedIn", percentage: 67, icon: "linkedin" },
          { name: "Instagram", percentage: 78, icon: "instagram" },
          { name: "Snapchat", percentage: 46, icon: "snapchat" },
          { name: "Google", percentage: 38, icon: "google" },
          { name: "Altaba", percentage: 15, icon: "altaba" },
        ]

        setCampaigns(mockCampaigns)
      } catch (error) {
        console.error("Error fetching campaign data:", error)
        // Fallback to sample data
        setCampaigns([
          { name: "Facebook", percentage: 55, icon: "facebook" },
          { name: "LinkedIn", percentage: 67, icon: "linkedin" },
          { name: "Instagram", percentage: 78, icon: "instagram" },
          { name: "Snapchat", percentage: 46, icon: "snapchat" },
          { name: "Google", percentage: 38, icon: "google" },
          { name: "Altaba", percentage: 15, icon: "altaba" },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

  const getIconColor = (icon: string) => {
    switch (icon) {
      case "facebook":
        return "#1877F2"
      case "linkedin":
        return "#0A66C2"
      case "instagram":
        return "#E4405F"
      case "snapchat":
        return "#FFFC00"
      case "google":
        return "#4285F4"
      case "altaba":
        return "#400090"
      default:
        return "#888888"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign</CardTitle>
        <CardDescription>Performance across marketing channels</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-[300px] items-center justify-center">
            <p>Loading campaign data...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.name} className="flex items-center">
                <div
                  className="mr-4 flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${getIconColor(campaign.icon)}20` }}
                >
                  <div className="h-5 w-5 rounded-full" style={{ backgroundColor: getIconColor(campaign.icon) }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{campaign.name}</p>
                    <p className="text-sm font-medium">{campaign.percentage}%</p>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${campaign.percentage}%`,
                        backgroundColor: getIconColor(campaign.icon),
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import ProfileContent, { UsageData } from "@/components/ProfileContent"
import { useUserProfile } from "@/hooks/useUserProfile"
import {  TeamClientsTable, TeamsTable, useTeamsFromId, useUsageSummary } from "./service/profileService"
import LoadingScreen from "@/components/LoadingScreen"
import { useEffect } from "react"
import { toast } from "sonner"


export default function ProfilePage() {
  const { data: profile, isLoading, isError, error } = useUserProfile();

  useEffect(() => {
    if (isError && orgError ) {
      const message = (error as Error | null)?.message ?? "Something went wrong";
      toast.error(message);
    }
  }, [isError, error]);

  const user_id: string = profile?.id || ""

  const {
      data: orgData,
      isLoading: orgLoading,
      isError: orgError,
    } = useTeamsFromId(profile?.id || "", profile?.org_id || "");
    
  const teamData = orgData?.team
  const clientsData = orgData?.clients 


    // Fetch usage data from the view
  const { data: usageData, isLoading: usageLoading } =  useUsageSummary(user_id)

  if (isLoading || orgLoading || usageLoading) {
    return <LoadingScreen />;
  }

  // 🛠 Handle no profile
  if (!profile) {
    return <div>No profile data available</div>;
  }


    return (
      <div className="flex w-full bg-white">
        <div className="container mx-auto px-4 py-8">
          <ProfileContent
            profile={profile as Profile}
            teamData={teamData as TeamsTable}
            clientsData={clientsData as TeamClientsTable[]}
            usageData={usageData as UsageData}
          />
        </div>
      </div>
    );
  }

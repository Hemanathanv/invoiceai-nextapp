"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, CreditCard, Building, Edit3, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUpdateProfileName } from "@/app/profile/service/profileService";


export interface TeamData {
  org_name: string;
  role: string;
}

export interface ClientData {
  client_name: string;
  client_email: string;
  status: string;
  client_id: string;
}

export interface UsageData {
  uploads_used: number;
  extractions_used: number;
}

export interface ProfileContentProps {
  profile: Profile;
  teamData: TeamData | null;
  clientsData: ClientData[];
  usageData: UsageData | null;
}

export default function ProfileContent({
  profile,
  teamData,
  clientsData,
  usageData
}: ProfileContentProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState<string>(profile.name || "");

  const updateNameMutation = useUpdateProfileName(profile.id, () => {
    setIsEditingName(false);
  });

  const handleSaveName = () => {
    if (!name.trim()) return;
    updateNameMutation.mutate(name);
  };

  const getUsagePercentage = (used: number, limit: number) =>
    Math.min((used / limit) * 100, 100);

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "from-red-500 to-pink-500";
    if (percentage >= 70) return "from-yellow-500 to-orange-500";
    return "from-blue-500 to-purple-500";
  };

  const uniqueClientsById = clientsData
  ? Array.from(
      new Map(clientsData.map(c => [c.client_id, c])).values()
    )
  : [];

  return (
    <div className="space-y-8 min-h-screen p-6 bg-white text-black dark:bg-neutral-900 dark:text-white">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
        <h1 className="text-4xl font-bold justify-self-start">Profile Settings</h1>
        <p className="text-black/70 dark:text-white/80 justify-self-start">
          Manage your account and view usage statistics
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Personal Info */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md dark:bg-neutral-900 dark:border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" /> Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <div className="flex items-center gap-2">
                  {isEditingName ? (
                    <>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                      />
                      <Button
                        size="sm"
                        onClick={handleSaveName}
                        disabled={updateNameMutation.isPending}
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIsEditingName(false);
                          setName(profile.name || "");
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 px-3 py-2 bg-gray-100 border rounded-md">
                        {profile.name || "Not set"}
                      </div>
                      <Button size="sm" variant="outline" onClick={() => setIsEditingName(true)}>
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <div className="flex-1 px-3 py-2 bg-gray-100 border rounded-md">
                    {profile.email}
                  </div>
                </div>
              </div>

              {/* Subscription */}
              <div className="space-y-2">
                <label className="text-sm font-medium p-2">Subscription</label>
                <Badge
                  className={`${
                    profile.subscription_tier === "Teams"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600"
                      : "bg-gradient-to-r from-blue-600 to-cyan-500"
                  } text-white px-3 py-1 rounded-md`}
                >
                  {profile.subscription_tier || "Free"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Usage */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md dark:bg-neutral-900 dark:border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" /> Usage & Credits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Uploads */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Uploads</span>
                  <span className="text-sm">
                    {usageData?.uploads_used ?? profile.uploads_used ?? 0} /{" "}
                    {profile.uploads_limit ?? 2}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full bg-gradient-to-r ${getUsageColor(
                      getUsagePercentage(
                        usageData?.uploads_used ?? profile.uploads_used ?? 0,
                        profile.uploads_limit ?? 2
                      )
                    )}`}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${getUsagePercentage(
                        usageData?.uploads_used ?? profile.uploads_used ?? 0,
                        profile.uploads_limit ?? 2
                      )}%`
                    }}
                    transition={{ delay: 0.5, duration: 1 }}
                  />
                </div>
              </div>

              {/* Extractions */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Extractions</span>
                  <span className="text-sm">
                    {usageData?.extractions_used ?? profile.extractions_used ?? 0} /{" "}
                    {profile.extractions_limit ?? 2}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full bg-gradient-to-r ${getUsageColor(
                      getUsagePercentage(
                        usageData?.extractions_used ?? profile.extractions_used ?? 0,
                        profile.extractions_limit ?? 2
                      )
                    )}`}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${getUsagePercentage(
                        usageData?.extractions_used ?? profile.extractions_used ?? 0,
                        profile.extractions_limit ?? 2
                      )}%`
                    }}
                    transition={{ delay: 0.7, duration: 1 }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Team Info */}
      {teamData && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-white border border-gray-200 shadow-sm dark:bg-neutral-900 dark:border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" /> Team Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Organization</label>
                  <div className="px-3 py-2 bg-gray-100 border rounded-md">
                    {teamData.org_name}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <div className="px-3 py-2 bg-gray-100 border rounded-md">
                    {teamData.role}
                  </div>
                </div>
              </div>

              {uniqueClientsById.length > 0 && (
                <div className="space-y-3 mt-4">
                  <label className="text-sm font-medium">Team Clients</label>
                  {uniqueClientsById.map((client) => (
                    <motion.div
                      key={client.client_id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{client.client_name}</div>
                        {client.client_email && (
                          <div className="text-sm">{client.client_email}</div>
                        )}
                      </div>
                      <Badge>{client.status}</Badge>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

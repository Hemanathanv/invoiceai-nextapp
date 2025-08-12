"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import {useClientsFromOrg } from "../service/extraction.service"
import { useUserProfile } from "@/hooks/useUserProfile"

// Mock clients data - replace with real data later
// const clients = [
//   { value: "all", label: "All Clients" },
//   { value: "client-a", label: "Client A" },
//   { value: "client-b", label: "Client B" },
//   { value: "client-c", label: "Client C" },
//   { value: "client-d", label: "Client D" },
// ]


interface ClientComboboxProps {
  value: string
  onChange: (value: string) => void
}

export function ClientCombobox({ value, onChange }: ClientComboboxProps) {
  const [open, setOpen] = useState(false)
  const { profile, loading: profileLoading } = useUserProfile()
  const orgId = profile?.org_id

  const { data: clients = []} = useClientsFromOrg(orgId || "")

 
  // const combinedClients  = [{ value: "all", label: "All Clients" }, ...(clients ?? [])]

  const combinedClients = clients ?? []

  const selectedClient = combinedClients.find((c) => c.value === value)


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between bg-transparent"
        >{profileLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          </>
        ) : (
          <>
          {selectedClient ? selectedClient.label : "Select client..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </>
      )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search clients..." />
          <CommandList>
            <CommandEmpty>No client found.</CommandEmpty>
            <CommandGroup>
              {/* {combinedClients.map((client) => ( */}
              {combinedClients.map(client => (
                <CommandItem
                  key={client.value}
                  value={client.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === client.value ? "opacity-100" : "opacity-0")} />
                  {client.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

import { createClient } from "@/utils/supabase/client"

export interface Client {
  id: string
  user_id: string
  org_id: string
  client_name: string
  client_email: string
  status: "Active" | "inActive"
  credits: number
  dbConnection?: string
}

const supabase = createClient()

/**
 * Fetch all clients for a given organization
 * @param orgID - the organization's UUID
 * @returns array of Client or throws error
 */
export async function getClientsForOrg(orgID: string): Promise<Client[]> {
  const { data, error } = await supabase
    .from("team_clients_table")
    .select("*")
    .eq("org_id", orgID)

  if (error) throw new Error(`Error loading clients: ${error.message}`)
  return data || []
}

/**
 * Add a new client to the organization
 * Checks for existing name or email and throws if duplicate
 * @param orgID - the organization's UUID
 * @param userID - the creator's user UUID
 * @param clientName - new client's name
 * @param clientEmail - new client's email
 * @returns the inserted Client
 */
export async function insertClient(
  orgID: string,
  userID: string,
  clientName: string,
  clientEmail: string
): Promise<Client> {
  // Check for duplicate name/email
  const { data: existing, error: checkErr } = await supabase
    .from("team_clients_table")
    .select("id")
    .eq("org_id", orgID)
    .or(`client_name.eq.${clientName},client_email.eq.${clientEmail}`)
    .limit(1)

  if (checkErr) {
    throw new Error(`Error checking client: ${checkErr.message}`)
  }
  if (existing && existing.length > 0) {
    throw new Error(
      "Client with that name or email already exists. Please choose different."
    )
  }

  // Insert new client row
  const payload = {
    user_id: userID,
    org_id: orgID,
    client_name: clientName,
    client_email: clientEmail,
    status: "inActive" as const,
    credits: 0,
    dbConnection: "excel",
  }

  const { data: inserted, error: insertErr } = await supabase
    .from("team_clients_table")
    .insert(payload)
    .select()
    .single()

  if (insertErr || !inserted) {
    throw new Error(`Error adding client: ${insertErr?.message || "unknown"}`)
  }

  return inserted
}

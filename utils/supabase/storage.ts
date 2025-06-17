// Name: V.Hemanathan
// Describe: This file contains the client side supabase storage.
// Framework: Next.js -15.3.2 , supabase

import { createClient } from '@/utils/supabase/client'

// Initialize the Supabase client
const supabase = createClient()

export async function getTotal() {
  const { data, error } = await supabase
    .storage
    .from('documents') // Replace with your bucket name
    .list('', { sortBy: { column: 'name', order: 'asc' } })

  if (error) {
    return 0
  } 


  let total = 0
  for (const file of data??[] ) {
    const thisFileSize =  file.metadata?.size ?? 0
    total += thisFileSize
    
  }

  return total
}


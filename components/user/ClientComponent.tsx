"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function ClientComponent() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data : user, error: authError } = await supabase.auth.getUser();

      const { data :user_profile, error: userError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.user?.id)
      .single();

      if (authError) {
        console.log("user doesnt exists")
      } else {
        setUser(user_profile);
      }
    }
    getUser();
  }, []);

  return <h2>{user?.name}</h2> ;
}

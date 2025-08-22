// Name: V.Hemanathan
// Describe: Server side authentication actions for login/register/forget password etc.
// Framework: Next.js -15.3.2  - supabase

'use server';

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { toast } from "sonner";


export async function getUserSession() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) {
        return null;
    }
    return {status: "success", user: data?.user};
}


export async function signUp(formData: FormData) {
    const supabase = await createClient();
    const credentials = {
        username: formData.get("username") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const { error, data } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
            data: {
                username: credentials.username,
            },
        }
    });

    if (error) {
        return { status: error?.message, user: null };

    } else if (data?.user?.identities?.length === 0) {
        return { status: "User already exists, please login", user: null };
    } 

    revalidatePath("/", "layout");
    return { status: "success", user: data.user };
}


export async function signIn(formData: FormData) {
    const supabase = await createClient();
    const credentials = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const { error, data } = await supabase.auth.signInWithPassword( credentials );

    if (error) {
        return { status: error?.message, user: null };
    }

    const { data: exisistingUser} = await supabase
    .from("profiles")
    .select("*")
    .eq("email", credentials?.email)
    .limit(1)
    .single();



    if (!exisistingUser) {
        const {error: insertError} = await supabase.from("profiles").insert({
            email: data?.user.email,
            name: data?.user?.user_metadata?.username,
            subscription_tier: "Free",
            is_admin: false,
            uploads_used: 0,
            uploads_limit: 5,
            extractions_used: 0,
            extractions_limit: 5,
        });
        if (insertError) { 
            return { status: insertError?.message, user: null };
            
            }
    }

    revalidatePath("/", "layout");
    return { status: "success", user: data.user };

}

export async function signOut() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
        redirect('/error') ;
    }

    revalidatePath('/', 'layout');
    redirect('/login') ;
}

export async function forgotPassword(formData: FormData) {
    const supabase = await createClient();
    const origin = (await headers()).get("origin");
    
    const { error } = await supabase.auth.resetPasswordForEmail(
        formData.get("email") as string,
        {
            redirectTo : `${origin}/reset-password`,
        }
    );
    if (error) {
        return { status: error?.message};
    }   

    return { status: "success"};
}


export async function resetPassword(formData: FormData, code: string) {
    const supabase = await createClient();
    const {error: codeError} = await supabase.auth.exchangeCodeForSession(code);
    if (codeError) {
        return { status: codeError?.message};
        }
    const {error} = await supabase.auth.updateUser({
        password: formData.get("password") as string,
    });
    if (error) {
        return { status: error?.message};
    }
    return { status: "success"};
}

export async function teamsignup(formData: FormData) {
    const supabase = await createClient();
  
    const username   = formData.get("username")   as string;
    const email      = formData.get("email")      as string;
    const password   = formData.get("password")   as string;
    const orgName    = formData.get("org-name")   as string;
    const orgIdValue = formData.get("org-id")     as string;
  
    // 1) See if there is already a profile row for this email
    const { data: existingProfiles, error: fetchErr } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .limit(1)
      .maybeSingle();
  
    if (fetchErr) {
      return { status: fetchErr.message, user: null };
    }
  
    let userId: string;
  
    if (existingProfiles) {
      // 2a) User already has a profile → just update their subscription_tier & org_id
      userId = existingProfiles.id;
  
      const { error: updErr } = await supabase
        .from("profiles")
        .update({
          name: username,
          subscription_tier: "Teams",
          org_id: orgIdValue,
          uploads_limit: 0,
          extractions_limit: 0,
          email: email
        })
        .eq("id", userId);
  
      if (updErr) {
        return { status: updErr.message, user: null };
      }
  
    } else {
      // 2b) New user → sign them up in Auth (this also creates a profiles row via your Auth trigger)
      const { data, error: signUpErr } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });
  
      if (signUpErr) {
        return { status: signUpErr.message, user: null };
      }
      userId = data.user!.id;
  
      // 2c) Now patch that new profile with the extra fields
      const { error: upsertErr } = await supabase
      .from("profiles")
      .upsert(
        {
          id:               userId, 
          name:             username,
          email:           email,            // required to match the newly created row
          subscription_tier: "Teams",
          org_id:            orgIdValue,
          uploads_limit: 0,
          extractions_limit: 0,
        },
        { onConflict: "id" }                 // if a row with this id already exists, it’s updated
      );
    
    if (upsertErr) {
      return { status: upsertErr.message, user: null };
    }
    }
  
    // 3) In both cases, insert a row into teams_table
    const { error: teamErr } = await supabase
      .from("teams_table")
      .insert({
        user_id:   userId,
        role:      "user",
        org_name:  orgName,
        org_id:    orgIdValue,
        // you can add other cols here if needed
      });
  
    if (teamErr) {
      return { status: teamErr.message, user: null };
    }
  
    // 4) finally, revalidate & return
    revalidatePath("/", "layout");
    return { status: "success", user: { id: userId, email } };
  }

export async function checkAvailability({
    username,
    email,
  }: {
    username?: string | null;
    email?: string | null;
  }) {
    const supabase = await createClient();
  
    const result = { usernameExists: false, emailExists: false };
  
    try {
      // check username if provided
      if (username && username.trim().length > 0) {
        const { data: udata, error: uerr } = await supabase
          .from("profiles")
          .select("id")
          .eq("name", username.trim())
          .limit(1)
          .maybeSingle();
  
        if (uerr){
          //console.log(uerr)
          throw uerr
        };
        //console.log(udata)
        //console.log(uerr)
        result.usernameExists = Boolean(udata);
      }
  
      // check email if provided
      if (email && email.trim().length > 0) {
        const normalized = email.trim().toLowerCase();
        const { data: edata, error: eerr } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", normalized)
          .limit(1)
          .maybeSingle();
  
        if (eerr) throw eerr;
        result.emailExists = Boolean(edata);
      }
  
      // Optionally: also check auth.users if you want absolute truth (requires admin)
      //const { data: authUser } = await supabase.auth.admin.getUserByEmail(normalized);
      //result.emailExists = result.emailExists || Boolean(authUser?.user);
      
      return result;
    } catch (err) {
      if (err instanceof Error){
      // on error, return conservative null-like state (so UX doesn't block forever)
      // console.log(err.message)
      return { usernameExists: false, emailExists: false, error: err?.message ?? "check failed" };
      }
    }
  }
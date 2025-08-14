// Name: V.Hemanathan
// Describe: This component is used to display the header of the application.It uses supabase to get the user details and display the user avatar and the navigation links
// Framework: Next.js -15.3.2 


import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/server';
import NavLinks from './headercomponents/Navlinks';
import UserAvatarDropdown from './headercomponents/userAvatar';
import AnimatedLogo from './headercomponents/AnimatedLogo';
import MobileMenuToggle from './headercomponents/MobileMenuToggle';

const Header = async() => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('is_admin, subscription_tier').eq('id', user?.id).single();


  // return;
  // }, [user, profiles, setProfile]);
  return (
    <header className="sticky top-0 z-20 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
      <AnimatedLogo />
        {/* <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 overflow-hidden rounded-full bg-white">
          <img
              src="/placeholder.svg"
              alt="InvoiceExtract Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <span className="font-bold text-xl">InvoiceAI</span>
          <span className="font-bold text-sm">(Beta)</span>
        </Link> */}

        <NavLinks isAuthenticated={!!user} isAdmin={profile?.is_admin} subscription={profile?.subscription_tier} />


        <div className="flex items-center space-x-4">
          {user? (
            // <Logout />
            <>
            <MobileMenuToggle />
            {/* <HeaderClient user={user}/> */}
            <UserAvatarDropdown name={user.user_metadata?.username ?? "Guest"} email={user.email!} />
            </>
            
          ) : (
            <>
              <Link href={{ pathname: '/login', query: { tab: 'login' } }}>
                <Button variant="outline">Login</Button>
              </Link>
              <Link href={{ pathname: '/register', query: { tab: 'signup' } }}>
                <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
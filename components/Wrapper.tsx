'use client';

import React, { useEffect } from 'react';
import { useProfile } from '@/context/GlobalState';
import { User } from '@supabase/supabase-js';

type Props = {
  user: User | null;
};

const HeaderClient: React.FC<Props> = ({ user }) => {
    const { profiles, setProfile } = useProfile();

    useEffect(() => {
      if (!user || profiles) return;
      setProfile(user);
    }, [user, profiles, setProfile]);

    return (<></>);
}
export default HeaderClient
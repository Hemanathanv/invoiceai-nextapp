'use client'; // only if using App Router
import { User } from '@supabase/supabase-js';
import { createContext, useContext, useState, ReactNode } from 'react';

type GlobalStateType = {
  remining_space: object | null;
  setRemining_space: (remining_space: object | null) => void;
};

// type ProfileContextType = {
//   profiles: User | null;
//   setProfile: (profile: User) => void;
// };

// const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// export const ProfileProvider = ({ children }: { children: ReactNode }) => {
//   const [profiles, setProfileState] = useState<User | null>(null);

//   const setProfile = (profile: User) => setProfileState(profile);

//   return (
//     <ProfileContext.Provider value={{ profiles, setProfile }}>
//       {children}
//     </ProfileContext.Provider>
//   );
// };

// export const useProfile = () => {
//   const context = useContext(ProfileContext);
//   if (!context) throw new Error('useProfile must be used within ProfileProvider');
//   return context;
// };
const GlobalStateContext = createContext<GlobalStateType | undefined>(undefined);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [remining_space, setRemining_space] = useState<object | null>(null);

  return (
    <GlobalStateContext.Provider value={{ remining_space, setRemining_space }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = (): GlobalStateType => {
  const context = useContext(GlobalStateContext);
  if (!context) throw new Error('useGlobalState must be used within GlobalStateProvider');
  return context;
};

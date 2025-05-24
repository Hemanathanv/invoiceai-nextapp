// app/components/UserAvatarDropdown.tsx
"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Settings, User, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import Logout from "@/components/user/Logout";

interface Props {
  name?: string;
  email: string;
}

const UserAvatarDropdown: React.FC<Props> = ({ name, email }) => {
  const router = useRouter();
  const initial = name?.charAt(0).toUpperCase() || email.charAt(0).toUpperCase();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
          {initial}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[160px] rounded-md border bg-white p-2 text-sm shadow-lg"
          sideOffset={8}
        >
          <DropdownMenu.Label className="px-2 py-1 font-medium text-muted-foreground">
            My Account
          </DropdownMenu.Label>

          <DropdownMenu.Item
            className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer"
            onClick={() => router.push("/profile")}
          >
            <User className="w-4 h-4" /> Profile
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer"
            onClick={() => router.push("/extractions")}
          >
            <FileText className="w-4 h-4" /> Extractions
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer"
            onClick={() => router.push("/settings")}
          >
            <Settings className="w-4 h-4" /> Settings
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="my-1 border-t" />

          {/* 
            Use `asChild` here so that Radix treats the <Logout/>'s internal <button> 
            as the “real” menu item. That way, clicking the <button> inside Logout 
            actually fires its form’s onSubmit handler. 
          */}
          <DropdownMenu.Item asChild>
            <Logout />
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default UserAvatarDropdown;

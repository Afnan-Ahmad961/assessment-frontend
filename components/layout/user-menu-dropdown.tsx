"use client";
// The interactive part of the user menu: avatar trigger, account details, and sign out.
import { useTransition } from "react";
import { LogOutIcon } from "lucide-react";

import { logout } from "@/actions/auth.actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserMenuDropdownProps = {
  fullName: string;
  email: string;
};

export function UserMenuDropdown({ fullName, email }: UserMenuDropdownProps) {
  const [isSigningOut, startSignOut] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon" className="rounded-full" aria-label="Account menu" />}
      >
        <Avatar className="size-8">
          <AvatarFallback className="text-xs font-medium">{getInitials(fullName)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-0.5">
            <span className="truncate text-sm font-medium text-foreground">{fullName}</span>
            <span className="truncate text-xs font-normal text-muted-foreground">{email}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={isSigningOut} onClick={() => startSignOut(() => logout())}>
          <LogOutIcon aria-hidden />
          {isSigningOut ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getInitials(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  const initials = parts.length > 1 ? `${parts[0]?.[0] ?? ""}${parts.at(-1)?.[0] ?? ""}` : (parts[0]?.slice(0, 2) ?? "");
  return initials.toUpperCase();
}

// Signed-in user's avatar menu in the app header. Loads the user on the server; must be rendered
// inside <Suspense> (see UserMenuSkeleton for the fallback).
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/lib/auth/current-user";

import { UserMenuDropdown } from "./user-menu-dropdown";

export async function UserMenu() {
  const user = await getCurrentUser();
  return <UserMenuDropdown fullName={user.fullName} email={user.email} />;
}

export function UserMenuSkeleton() {
  return <Skeleton className="size-8 rounded-full" />;
}

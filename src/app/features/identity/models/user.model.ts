export interface IdentityUser {
  id: string;
  userName: string;
  email?: string;
  isGlobalSuperAdmin?: boolean;
}
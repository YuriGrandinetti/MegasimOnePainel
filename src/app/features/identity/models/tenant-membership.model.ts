export interface IdentityTenantMembership {
  userId: string;
  tenantId: string;
  roles: string[];
  isDefault: boolean;
}
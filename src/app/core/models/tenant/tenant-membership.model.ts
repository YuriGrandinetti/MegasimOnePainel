export interface TenantMembership {
  userId: string;
  tenantId: string;
  roles: string[];
  isDefault: boolean;
}
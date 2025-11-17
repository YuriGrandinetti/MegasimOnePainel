export interface UserIdentity {
  id: string;
  userName: string;
  email?: string;
  roles: string[];
  tenantId: string;
  tenantCode: string;
  tenantName: string;
}
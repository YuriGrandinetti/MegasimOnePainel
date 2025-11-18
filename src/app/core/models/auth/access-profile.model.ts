export interface AccessProfile {
  id: string;              // ex.: 'tenant-admin', 'finance-operator'
  name: string;            // ex.: 'Administrador do Cliente'
  description: string;
  roles: string[];         // roles que esse perfil aplica (UserTenantRoles.RoleName)
}

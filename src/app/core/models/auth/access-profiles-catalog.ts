import { AccessProfile } from './access-profile.model';

export const ACCESS_PROFILES_CATALOG: AccessProfile[] = [
  {
    id: 'tenant-admin',
    name: 'Administrador do Cliente',
    description: 'Administra usuários, permissões e configurações do tenant.',
    roles: [
      'Tenant.Admin',
      'Reports.Admin',
      'Customer.Manager',
      'Finance.Manager',
      'Billing.Manager'
    ]
  },
  {
    id: 'finance-manager',
    name: 'Gestor Financeiro',
    description: 'Responsável pela área financeira do tenant.',
    roles: [
      'Finance.Manager',
      'Reports.Viewer'
    ]
  },
  {
    id: 'finance-operator',
    name: 'Operador Financeiro',
    description: 'Executa operações financeiras do dia a dia.',
    roles: [
      'Finance.Operator',
      'Reports.Viewer'
    ]
  },
  {
    id: 'billing-manager',
    name: 'Gestor de Faturamento',
    description: 'Administra faturamento e regras de cobrança.',
    roles: [
      'Billing.Manager',
      'Reports.Viewer'
    ]
  },
  {
    id: 'billing-operator',
    name: 'Operador de Faturamento',
    description: 'Emite faturas, registra cobranças.',
    roles: [
      'Billing.Operator',
      'Reports.Viewer'
    ]
  },
  {
    id: 'reports-viewer',
    name: 'Usuário de Relatórios',
    description: 'Consulta relatórios e dashboards.',
    roles: [
      'Reports.Viewer'
    ]
  },
  {
    id: 'read-only',
    name: 'Usuário Somente Consulta',
    description: 'Apenas leitura em módulos principais.',
    roles: [
      'Finance.Viewer',
      'Billing.Viewer',
      'Customer.Viewer',
      'Reports.Viewer'
    ]
  }
];


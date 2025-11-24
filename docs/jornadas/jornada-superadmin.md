# 🧭 Jornada 1 — Super Admin (Sócios e Colaboradores da Plataforma MEGASIM One)

## 🎯 Objetivo
Gerir toda a plataforma SaaS **MEGASIM One**, incluindo:
- Administração de **tenants (empresas clientes)**  
- Definição e controle de **planos e assinaturas**  
- **Cobrança, faturamento** e notas de serviço  
- **Gestão de colaboradores internos** (suporte, comercial, financeiro, técnico)  
- **Governança geral**, auditoria e relatórios globais

---

## 🧱 Estrutura hierárquica de papéis (nível plataforma)

| Papel | Pertence a | Escopo | Permissões principais |
|-------|-------------|--------|------------------------|
| **Super Admin** | Sócios MEGASIM One | Global | Controle total da plataforma (planos, billing, usuários, logs) |
| **Admin de Área** | MEGASIM One (colaborador) | Departamental | Gestão de área (Suporte, Comercial, Financeiro, Técnico) |
| **Suporte** | MEGASIM One | Operacional | Acessar tickets, visualizar tenants e usuários, auxiliar clientes |
| **Comercial** | MEGASIM One | Comercial | Gerenciar leads, propostas e upgrades |
| **Financeiro** | MEGASIM One | Financeiro | Emitir cobranças, conciliar pagamentos |
| **Técnico** | MEGASIM One | Infraestrutura | Manutenção de integrações, logs e APIs |

---

## 🔹 1. Login e autenticação

```text
[Login MEGASIM One]
  → E-mail / Senha / MFA (para Super Admins e colaboradores)
  ↓
[Dashboard Global da Plataforma]
  → KPIs: Tenants ativos, novos cadastros, faturamento, tickets em aberto


🔹 2. Gestão de Colaboradores Internos (MEGASIM One)
[Aba: Colaboradores]
  → Lista de usuários internos (nome, área, papel)
  → Botão: [+ Adicionar Colaborador]
       - Nome, e-mail, função (Suporte, Comercial, Financeiro, Técnico)
       - Permissões detalhadas (ex: ler tenants, editar planos)
  → Ações:
       - Ativar/desativar acesso
       - Resetar senha / MFA
  → Logs de atividades por colaborador


Governança:

Super Admin define áreas e papéis disponíveis

Cada área (ex: Suporte) pode ter seu próprio Admin de Área

Permissões limitadas e auditáveis

🔹 3. Gestão de Empresas (Tenants)
[Aba: Empresas]
  → Listar todos os tenants (Ativos / Em teste / Inativos)
  → [+ Criar Tenant]
       - Nome fantasia / Razão social
       - CNPJ
       - Responsável (usuário cliente)
       - Plano inicial
  → Ações:
       - Editar plano
       - Pausar / Reativar
       - Acessar tenant (modo suporte)
       - Ver faturamento e histórico de uso


💡 Exemplo: O Super Admin cria um tenant após uma venda.
O responsável do cliente recebe um convite para ativar sua conta e concluir o onboarding fiscal.

🔹 4. Planos e Assinaturas
[Aba: Planos e Assinaturas]
  → Criar / editar planos:
       - Nome do plano (Free, Standard, Pro, Enterprise)
       - Limites (usuários, notas, CNPJs)
       - Preço mensal / anual
       - Recursos incluídos
  → Associar planos a tenants
  → Monitorar upgrades/downgrades

🔹 5. Faturamento e Cobrança
[Aba: Faturamento]
  → Exibir pagamentos recebidos
  → Status: Pago / Pendente / Atrasado
  → Emitir NFS-e (MEGASIM One → cliente)
  → Logs de tentativas de cobrança
  → Notificações automáticas

🔹 6. Suporte e Acesso Técnico
[Aba: Suporte]
  → Tickets abertos pelos clientes
  → Filtro: Tenant / Tipo / Urgência
  → Ação: [Acessar Tenant em modo suporte]
       - Entrar temporariamente como Admin do tenant (com log)
  → Encaminhar para áreas (Comercial, Técnico)
  → Histórico de atendimentos

🔹 7. Relatórios e Métricas
[Aba: Relatórios]
  → KPIs por período:
       - Tenants ativos
       - Taxa de conversão de leads
       - Faturamento total / recorrente
       - Chamados resolvidos
       - Planos mais vendidos
  → Exportar CSV / API / Dashboard BI
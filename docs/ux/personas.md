# 🧍‍♂️ Personas e Cenários de Uso — MEGASIM One

## 🎯 Objetivo
Definir perfis realistas de usuários do sistema SaaS MEGASIM One para orientar decisões de UX, fluxos e linguagem.

---

## 👤 Persona 1 — Super Admin (Sócio / Gestor da Plataforma)

| Atributo | Descrição |
|-----------|------------|
| **Nome** | Ricardo Andrade |
| **Idade** | 42 anos |
| **Cargo / Papel** | Sócio da MEGASIM One |
| **Objetivos** | Gerenciar todos os tenants, planos e faturamento da plataforma SaaS. |
| **Motivações** | Garantir estabilidade, governança e escalabilidade. |
| **Frustrações** | Falta de visão centralizada de faturamento e suporte. |
| **Comportamento digital** | Usa dashboards diariamente, prefere informações resumidas e alertas automatizados. |

### 🧩 Cenário de uso
Ricardo acessa o painel global da plataforma para verificar o status de todos os clientes (tenants).  
Ele identifica que um cliente está com faturas vencidas e envia um lembrete automático.  
Em seguida, revisa relatórios de performance e aprova a criação de um novo plano “Pro Fiscal”.

---

## 👤 Persona 2 — Administradora da Empresa (Tenant Multioperacional)

| Atributo | Descrição |
|-----------|------------|
| **Nome** | Juliana Pires |
| **Idade** | 36 anos |
| **Cargo / Papel** | Administradora Financeira de um escritório contábil |
| **Objetivos** | Emitir notas fiscais de serviço (NFS-e) e produtos (NF-e) no mesmo sistema. |
| **Motivações** | Reduzir retrabalho e centralizar a gestão fiscal e financeira. |
| **Frustrações** | Dificuldade em entender mensagens técnicas e erros de certificado digital. |
| **Comportamento digital** | Usa sistemas fiscais diariamente, mas valoriza interfaces claras e guias passo a passo. |

### 🧩 Cenário de uso
Juliana entra no sistema pela primeira vez e é recebida por um assistente de configuração.  
Ela escolhe ativar os módulos **NF-e** e **NFS-e**.  
Durante o teste de comunicação com a prefeitura, o sistema detecta um erro e mostra um link direto para o portal municipal.  
Após ajustar as credenciais, ela emite sua primeira nota com sucesso e vê o faturamento atualizado no dashboard.

---

## 👤 Persona 3 — Operador PDV (NFC-e)

| Atributo | Descrição |
|-----------|------------|
| **Nome** | Lucas Menezes |
| **Idade** | 24 anos |
| **Cargo / Papel** | Atendente de loja / Caixa |
| **Objetivos** | Emitir NFC-e de forma rápida e sem erros no ponto de venda. |
| **Motivações** | Atendimento ágil e sem filas. |
| **Frustrações** | Travamentos ou mensagens de erro técnicas durante vendas. |
| **Comportamento digital** | Usa o sistema em tela de PDV, com teclado e leitor de código de barras. |

### 🧩 Cenário de uso
Lucas inicia o turno e abre o caixa.  
Durante uma venda, a conexão com a SEFAZ cai.  
O sistema muda automaticamente para **modo contingência** e exibe “Venda salva — enviar quando reconectar”.  
Ele continua o atendimento sem perder o ritmo.  
Mais tarde, ao reabrir o PDV, as notas pendentes são transmitidas automaticamente.

---

## 👤 Persona 4 — Usuária Fiscal / Contadora

| Atributo | Descrição |
|-----------|------------|
| **Nome** | Mariana Ribeiro |
| **Idade** | 29 anos |
| **Cargo / Papel** | Contadora de empresa do Simples Nacional |
| **Objetivos** | Emitir NFS-e e exportar relatórios fiscais com segurança. |
| **Motivações** | Simplificar as rotinas mensais de fechamento contábil. |
| **Frustrações** | Mensagens técnicas difíceis e necessidade de repetir tarefas. |
| **Comportamento digital** | Prefere mensagens em linguagem simples e tutoriais embutidos. |

### 🧩 Cenário de uso
Mariana acessa o sistema para gerar o relatório mensal de faturamento.  
Ela localiza a opção “Exportar para contador” e escolhe o formato XML + CSV.  
O sistema agrupa as notas do período, valida duplicidades e avisa sobre certificados próximos do vencimento.  
Ela conclui o fechamento em poucos minutos e envia os arquivos para o cliente.

---

## 💡 Recomendações de UX a partir das personas
- **Linguagem adaptada**: termos fiscais simplificados e mensagens empáticas.  
- **Assistentes guiados**: onboarding passo a passo (especialmente para Juliana).  
- **Feedbacks visuais claros**: estados de sucesso, erro e contingência (para Lucas).  
- **Dashboards inteligentes**: KPIs visuais e links rápidos (para Ricardo).  
- **Exportações simples**: acessos rápidos para contadores (para Mariana).

---

## 🧭 Próximos passos
1. Validar essas personas com usuários reais (ou representantes internos).  
2. Criar **User Stories** derivadas, ex.:  
   - “Como [persona], quero [objetivo], para [benefício].”  
3. Conectar cada persona às jornadas UX correspondentes (Jornada 1 a 4).  
4. Usar essas informações como base para wireframes e protótipos.

---


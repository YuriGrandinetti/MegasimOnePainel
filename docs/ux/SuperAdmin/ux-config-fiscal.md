# 🧭 UX — Configuração Fiscal do Tenant (Empresas e Estabelecimentos)

## 🎯 Objetivo
Oferecer uma experiência unificada de configuração fiscal para cada Tenant (empresa + estabelecimento), com foco na clareza e na progressividade.  
A proposta elimina a fragmentação por tabelas e orienta o usuário a partir da **intenção de uso**: “configurar emissão fiscal”, e não “preencher campos técnicos”.

---

## 🧱 Estrutura Geral da Experiência

O painel principal será um **Console 360° do Tenant**, que concentra todas as informações da empresa e seus estabelecimentos, apresentando-as em **abas colapsáveis** (expandir/recolher), reduzindo a troca de contexto.

---

## ⚙️ Opção 1 — Console 360° do Tenant

### 🧩 Conceito
Uma única tela com várias **seções colapsáveis**, agrupadas por intenção, permitindo que o usuário visualize e mantenha todas as configurações fiscais e administrativas da empresa.

### 📂 Seções sugeridas

#### **1. Identificação**
- Exibe dados vindos de `empresa` e `pessoa`.
- Campos: CNPJ, Razão Social, Nome Fantasia, UF, Regime Tributário, Situação.
- Ações: “Validar CNPJ” e “Sincronizar dados cadastrais”.

#### **2. Estabelecimentos**
- Exibe lista de estabelecimentos vinculados ao Tenant (`estabelecimento`).
- Cada card mostra: Nome, Localização, Situação, e status fiscal (NF-e / NFC-e / NFS-e).
- Ação: “Configurar este Estabelecimento”.

#### **3. Configuração Fiscal por Estabelecimento**
- Cada estabelecimento possui três sub-seções com toggles de ativação:
  - **NF-e**: Ambiente, Série, Próximo número, Certificado.
  - **NFC-e**: Ambiente, CSC ID/Token, Série, Impressora, Contingência.
  - **NFS-e**: Inscrição Municipal, Município, Provedor, Série RPS, Próximo RPS, CNAE, Alíquota.
- Ações: “Ativar Tipo”, “Testar Configuração”, “Salvar”.

#### **4. Numeração & Sequenciais**
- Exibe os números de controle para notas fiscais e serviços.
- Origem: `empresaparametro` ou campos `prox_numero` nas tabelas de configuração.
- Ações: “Zerar contador” (com confirmação) e “Sincronizar numeração”.

#### **5. Usuários & Acessos**
- Exibe os usuários com acesso ao Tenant (`UserTenants`).
- Opções: “Adicionar Admin local”, “Revogar acesso”.

#### **6. Auditoria & Logs**
- Histórico das ações administrativas: ativações, edições e testes de configuração.
- Pode consumir logs da aplicação.

---

### 🎨 Interação Visual
- Cada seção é **colapsável**, expandindo apenas quando o usuário precisa editar.
- Ícones e cores representam o estado dos tipos fiscais:
  - ⚪ **Desativado**  
  - 🟡 **Pendente**  
  - 🟢 **Ativo**
- Feedback imediato após “Testar Configuração”.
- Mensagens simples e explicativas (“CSC inválido”, “Certificado expirado em 12 dias”).

---

## 📊 PlantUML — Console 360° (UX de Manutenção)



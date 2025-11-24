# 🧭 Jornada 2 — Administrador da Empresa Cliente (Tenant)

## 🎯 Objetivo
Permitir que o **administrador da empresa cliente** configure sua conta (tenant), convide a equipe, finalize o **onboarding fiscal** (CNPJ, certificado A1, séries e regras), e **emita a primeira nota** com o **financeiro básico integrado**.

---

## 👤 Perfis dentro do tenant
| Papel | Escopo | Permissões principais |
|------|--------|------------------------|
| **Administrador da Empresa** | Tenant | Configurações fiscais, usuários internos, séries/numeração, integrações |
| **Fiscal/Operador** | Emissão | Emite NF-e, NFC-e, NFS-e; gerencia cadastros de clientes/itens |
| **Financeiro** | Financeiro básico | Contas a receber/pagar, baixas, fluxo de caixa |
| **Leitura/Contador** | Auditoria/Exportação | Exporta XMLs/relatórios, consulta notas e financeiro |

---

## 🔹 Jornada resumida

1. **Acesso ao tenant**
   - Login → seleção de organização (se tiver mais de uma)
   - Checagem de pendências de onboarding

2. **Onboarding fiscal (wizard)**
   - CNPJ/IE/IM + endereço
   - Upload do **certificado A1** + senha
   - **Teste de comunicação** com SEFAZ (e com prefeitura para NFS-e, se aplicável)
   - **Séries e numeração** (NF-e/NFC-e/NFS-e)
   - **Regime tributário** (Simples Nacional) + **presets** de CFOP/CSOSN/NCM/ISS
   - Importação opcional: **clientes/produtos/serviços (CSV)**

3. **Equipe e permissões**
   - Convidar usuários (e-mail)
   - Definir papéis (Admin, Fiscal, Financeiro, Leitura/Contador)

4. **Primeira emissão**
   - **NF-e** (exemplo padrão): Cliente → Itens → Pagamento → Revisão → Transmissão
   - Resultado: **Autorizada** (PDF/enviar) ou **Rejeitada** (mensagem + ação sugerida)

5. **Financeiro básico**
   - Contas a receber criadas automaticamente quando a venda é a prazo
   - Baixas por Pix/Cartão/Boleto/Dinheiro
   - Fluxo de caixa simples (entradas/saídas)

6. **Relatórios e rotinas**
   - Faturamento do mês e **12 meses** (limite do Simples)
   - XMLs e **exportação para o contador**
   - Alertas: certificado vencendo, pendências de emissão, rejeições

---

## 🧩 Esboço estrutural (wireframe textual – Nível 1)

```text
[Login]
  → Selecionar Organização (se houver várias)
  ↓
[Dashboard do Tenant]
  → Cards de pendência: "Concluir Onboarding", "Subir Certificado", "Emita sua 1ª nota"
  ↓
[Onboarding]
  1) Dados da Empresa (CNPJ/IE/IM/Endereço)
  2) Certificado A1 + senha  → [Testar SEFAZ]
  3) Séries/Numeração (NF-e/NFC-e/NFS-e)
  4) Fiscal (Simples, CFOP/CSOSN/NCM/ISS)
  5) Importar Clientes/Produtos/Serviços (opcional)
  → [Concluir]
  ↓
[Equipe]
  → Convidar usuários (Admin/Fiscal/Financeiro/Leitura)
  ↓
[Emissão - NF-e]
  → Cliente → Itens → Pagamento → Revisão → [Transmitir]
  ↓
[Resultado]
  → Autorizada: PDF / Enviar / Histórico
  → Rejeitada: Mensagem + Voltar para etapa
  ↓
[Financeiro]
  → Contas a Receber (automático se a prazo)
  → Baixas (Pix/Cartão/Boleto/Dinheiro)
  → Fluxo de Caixa


🧭 Jornada 2 — Administrador da Empresa Cliente (Tenant)
🔹 visão geral

Esta jornada será o ponto de partida após o Super Admin criar o tenant (empresa cliente).
A partir daqui, o usuário “Administrador da Empresa” segue um onboarding guiado, personalizado pelo tipo de operação fiscal da empresa:

Tipo de empresa	Documento principal	Jornada derivada
Prestadora de serviços	NFS-e (ISS)	Jornada 2A
Comércio varejista (PDV)	NFC-e (Cupom)	Jornada 2B
Indústria / atacado (produtos)	NF-e (modelo 55)	Jornada 2C
🧩 Jornada 2A — Empresa de Serviços (NFS-e)
🎯 Objetivo

Configurar ambiente de NFS-e, cadastrar serviços e emitir notas com retenções e regras municipais.

🧱 Etapas resumidas

Login / Selecionar Organização

Onboarding Fiscal (NFS-e)

Município / Provedor (GINFES, ABRASF, Betha, etc.)

Credenciais / Certificado A1

Códigos de serviço (LC 116)

Alíquotas e regras de retenção (ISS, INSS, IR, PIS/COFINS/CSLL)

Teste de conexão municipal

Equipe e Permissões

Convidar Fiscal, Financeiro, Leitura

Emissão

Tomador PJ → Serviço → Retenções → Transmitir RPS → NFS-e

Sucesso: PDF / Envio / Financeiro

Rejeição: mensagem + correção

Financeiro

Contas a receber / Baixas / Relatórios ISS

🧩 Jornada 2B — Comércio Varejista (PDV / NFC-e)
🎯 Objetivo

Guiar o lojista na configuração do PDV e emissão de NFC-e (modelo 65) com fluxo de caixa diário.

🧱 Etapas resumidas

Login / Selecionar Organização

Onboarding PDV

Série NFC-e / Certificado A1

Configuração de impressora (SAT/MFE) ou API SEFAZ

Configuração de formas de pagamento

Abertura de Caixa

Venda

Adicionar itens (leitor de código)

CPF opcional

Pagamento (Pix, Cartão, Dinheiro)

Emitir NFC-e → Autorizada ou Contingência

Fechamento de Caixa

Sangria / Fechamento / Resumo por meio de pagamento

🧩 Jornada 2C — Indústria / Atacado (Produtos / NF-e)
🎯 Objetivo

Configurar emissão de NF-e modelo 55, com cadastros de clientes, produtos e integrações ERP.

🧱 Etapas resumidas

Login / Selecionar Organização

Onboarding NF-e

Dados da empresa (CNPJ/IE/IM)

Certificado A1 / Série e Numeração

CFOP / CSOSN / NCM / Regime tributário

Teste de comunicação SEFAZ

Cadastros

Clientes / Produtos / Transportadoras

Emissão

Cliente → Itens → Pagamento → Revisão → Transmitir NF-e

Autorizada → PDF / XML / Envio e-mail

Rejeitada → mensagem + correção

Financeiro

Contas a receber / Estoque / Relatórios de vendas

🧭 Jornada 2 — Administrador da Empresa Multioperacional (NF-e, NFC-e e NFS-e)
🎯 Objetivo

Permitir que o Administrador da Empresa (Tenant) configure seu ambiente fiscal para emitir um ou mais tipos de documentos fiscais com o mesmo CNPJ, conforme o modelo de negócio da empresa (comércio, serviços ou ambos).

🧱 Etapas principais

Login e seleção de organização (tenant)

Verificação de permissão e status de onboarding.

Assistente de Onboarding Fiscal Unificado

Cadastro da empresa: CNPJ, IE, IM, endereço, regime tributário.

Upload do certificado A1 e senha.

Seleção dos módulos fiscais que serão utilizados:

✅ NF-e — Nota Fiscal Eletrônica (produtos, modelo 55)

✅ NFC-e — Nota Fiscal de Consumidor Eletrônica (PDV, modelo 65)

✅ NFS-e — Nota Fiscal de Serviços Eletrônica (municipal)

Para cada módulo ativado:

Configuração específica (séries, numeração, credenciais).

Teste de comunicação (SEFAZ estadual ou prefeitura).

Conclusão do onboarding.

Equipe e permissões

Convidar usuários (Fiscal, Financeiro, PDV, Serviços, Leitura).

Emissão

O sistema disponibiliza os três fluxos:

NF-e → vendas de produtos (atacado, indústria).

NFC-e → vendas presenciais (PDV).

NFS-e → prestação de serviços (municipal).

Cada emissão segue seu respectivo fluxo e validações.

Financeiro e relatórios unificados

Contas a receber unificadas.

Relatórios por tipo de nota (produtos, serviços, PDV).

Exportações fiscais (SPED, XMLs, ISS, etc.).


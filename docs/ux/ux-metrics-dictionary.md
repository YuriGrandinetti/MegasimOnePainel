Eventos de telemetria sugeridos (para instrumentar)

Front-end (UX):

onboarding_start, onboarding_complete

emit_click_tipo (nfe/nfce/nfse)

emit_start, emit_success, emit_fail

help_open, help_article_view, help_ai_resolved:true/false

task_time_ms:{jornada}

Back-end:

sefaz_rejection:{code}, pref_rejection:{code}

protocol_received, certificate_error:{type}

ar_create_auto, payment_settle, reconcile_ok

Metas práticas (baseline → meta)

Tempo 1ª emissão: baseline atual → ≤ 3 min

Rejeição média: baseline → ≤ 2%

Onboarding 24h: baseline → ≥ 80%

Resolução via IA/ajuda: baseline → ≥ 50%

Acurácia conciliação: baseline → ≥ 98%

# 📊 Dicionário de Métricas UX — MEGASIM One

## 🎯 Objetivo
Definir as métricas principais de experiência do usuário (UX), garantindo clareza, rastreabilidade e alinhamento entre times.

---

## 🔹 1. Ativação

| Métrica | Fórmula | Fonte de Dados | Meta | Responsável |
|----------|----------|----------------|------|--------------|
| **Tempo até 1ª emissão** | `timestamp(emissao_1) - timestamp(cadastro_tenant)` | Evento UX: `onboarding_complete` + `emit_success` | ≤ 3 minutos | UX + Produto |
| **Taxa de conclusão de onboarding (24h)** | `(tenants_onboarded_24h / tenants_totais) × 100` | Logs de tenant + Telemetria UX | ≥ 80% | UX Ops |
| **Módulos habilitados por tenant** | `total_modulos_ativos / tenants` | Configuração do tenant (DB) | ≥ 1,5 | Produto |

---

## 🔹 2. Emissão

| Métrica | Fórmula | Fonte | Meta | Responsável |
|----------|----------|--------|------|--------------|
| **Notas por tenant ativo/dia** | `notas_emitidas / tenants_ativos` | Logs fiscais (NF-e/NFC-e/NFS-e) | Tendência ↑ | Data |
| **Usuários com emissão semanal** | `(usuarios_com_emissao_semana / usuarios_totais) × 100` | Eventos UX + Logs fiscais | ≥ 70% | Produto |

---

## 🔹 3. Qualidade Fiscal

| Métrica | Fórmula | Fonte | Meta | Responsável |
|----------|----------|--------|------|--------------|
| **Taxa de rejeição** | `(rejeicoes / emissões_totais) × 100` | SEFAZ / Prefeitura / Logs fiscais | ≤ 2% | Engenharia Fiscal |
| **Tempo de correção de rejeição** | `timestamp(rejeicao_corrigida) - timestamp(rejeicao)` | Logs fiscais | ≤ 10 min | UX + Produto |
| **Falhas de certificado** | `ocorrencias_erro_cert / emissões_totais` | Logs fiscais + Eventos back-end | ↓ 50%/trim | Eng. Infra |

---

## 🔹 4. Financeiro

| Métrica | Fórmula | Fonte | Meta | Responsável |
|----------|----------|--------|------|--------------|
| **Contas criadas automaticamente** | `(cr_automáticas / cr_totais) × 100` | Back-end Financeiro | ≥ 95% | Eng. Financeiro |
| **Tempo até baixa após recebimento** | `timestamp(baixa) - timestamp(pagamento)` | Logs financeiros | ≤ 24h | Produto |
| **Conciliação correta** | `(pagamentos_conciliados / pagamentos_totais) × 100` | Back-end Financeiro + Gateway | ≥ 98% | Financeiro |

---

## 🔹 5. Suporte

| Métrica | Fórmula | Fonte | Meta | Responsável |
|----------|----------|--------|------|--------------|
| **Resolução via IA / ajuda contextual** | `(interacoes_resolvidas_ia / total_interacoes) × 100` | Logs do assistente | ≥ 50% | UX + IA |
| **Tempo 1ª resposta** | `timestamp(resposta) - timestamp(ticket_aberto)` | Sistema de tickets | ≤ 15 min | Suporte |
| **Tickets por 100 emissões** | `(tickets_abertos / emissoes_totais) × 100` | Helpdesk + Logs fiscais | Tendência ↓ | UX Ops |

---

## 🔹 6. Experiência (Satisfação / Eficiência)

| Métrica | Fórmula | Fonte | Meta | Responsável |
|----------|----------|--------|------|--------------|
| **NPS** | `% Promotores - % Detratores` | Pesquisas In-App | ≥ 70 | UX Research |
| **CSAT (Satisfação por jornada)** | `Σ avaliações / nº respostas` | Pesquisas In-App | ≥ 4.5 | UX Research |
| **Conclusão sem erro** | `(tarefas_concluidas_sem_erro / tarefas_totais) × 100` | Eventos UX | ≥ 85% | UX + Produto |
| **Adoção de features-chave** | `(usuarios_que_usaram_recurso / usuarios_totais) × 100` | Telemetria UX | ≥ 60% | Produto |

---

## 🔹 7. Observabilidade / Governança

| Métrica | Fórmula | Fonte | Meta | Responsável |
|----------|----------|--------|------|--------------|
| **Logs rastreáveis por tenant** | `(logs_com_id_tenant / logs_totais) × 100` | Sistema de observabilidade | 100% | Eng. Observabilidade |
| **Alertas resolvidos automaticamente** | `(alertas_auto_resolvidos / alertas_totais) × 100` | Monitoramento + IA | ≥ 60% | DevOps / IA |
| **Cobertura de telemetria UX** | `(eventos_instrumentados / eventos_totais_identificados) × 100` | UX Analytics | ≥ 90% | UX Ops |

---

## 🧩 Mapeamento com Diagrama

| Categoria | Referência Visual |
|------------|------------------|
| Métricas UX Gerais | [UX Dashboard Metrics](https://raw.githubusercontent.com/YuriGrandinetti/MegasimOnePainel/main/imagens/docs/diagrams/ux-dashboard-metrics.svg) |
| Fluxo de Dados | [UX Data Flow Map](https://raw.githubusercontent.com/YuriGrandinetti/MegasimOnePainel/main/imagens/docs/diagrams/ux-data-flow-map.svg) |
| Governança | [UX Governance Map](https://raw.githubusercontent.com/YuriGrandinetti/MegasimOnePainel/main/imagens/docs/diagrams/ux-governance-map.svg) |

---

## 🔁 Processo de Revisão

| Frequência | Atividade | Responsável |
|-------------|------------|--------------|
| Diária | Coleta automática de métricas (telemetria) | Eng. Observabilidade |
| Semanal | Revisão de dados e alertas | UX Ops + Produto |
| Quinzenal | Atualização do dashboard BI | Data / IA |
| Mensal | Revisão de metas e roadmap UX | Super Admin + UX Lead |
| Trimestral | Auditoria de métricas e recalibração de KPIs | UX Governance |

---

## 💡 Diretrizes Gerais
- Todas as métricas devem possuir **fonte rastreável e timestamp padronizado (UTC)**.  
- Nenhum dado pessoal sensível é usado em IA/Analytics (anonimização obrigatória).  
- O dashboard UX deve refletir **tanto performance técnica quanto percepção de valor**.  
- Toda métrica que cair abaixo do limiar aciona **alerta automático** via Slack/Email.

---

> 📁 Sugestão: vincular esse arquivo diretamente no painel BI (Power BI / Metabase / Grafana) como referência viva de documentação UX.

# ✅ UX Checklist — Configuração Fiscal (Tenant / Empresa / Estabelecimento)

Este documento orienta o processo completo de evolução **UX**, após a criação das tabelas, fluxos e wireframes.  
Ele serve como guia interno para validar e evoluir a experiência do usuário **sem envolver código**.

---

## 🧭 1. Refinamento dos Wireframes
- [ ] Revisar títulos e agrupamentos (identificação, fiscais, usuários, logs).
- [ ] Garantir que os nomes dos campos são compreensíveis para usuários fiscais e não técnicos.
- [ ] Validar consistência entre NF-e, NFC-e e NFS-e (mesmo padrão de campos e ações).
- [ ] Adicionar notas de ajuda contextual (ícones “?” ou textos leves sob campos críticos).

**Entrega esperada:**  
> Wireframes ajustados (`ux-wire-console360-salt.puml`, `ux-wire-wizard-salt.puml`) e SVGs atualizados no repositório.

---

## 🎨 2. Prototipagem Navegável
- [ ] Criar protótipos interativos no Figma, Miro, Whimsical ou Maze.
- [ ] Simular interações de ativar/desativar tipos fiscais.
- [ ] Incluir feedbacks visuais (alertas, sucesso, erro, progresso).
- [ ] Navegação fiel à jornada definida nos PlantUMLs (`ux-config-fiscal-console360`, `ux-config-fiscal-wizard`).

**Entrega esperada:**  
> Link público Figma + imagens (`imagens/docs/diagrams/ux-prototipo-*.png`).

---

## 🧪 3. Testes de Usabilidade
- [ ] Montar roteiro de teste (tarefas reais: ativar NF-e, testar configuração, salvar e verificar status).
- [ ] Convidar usuários representativos (contadores, administradores, suporte fiscal).
- [ ] Observar tempo, dúvidas e erros.
- [ ] Registrar insights: pontos de atrito e fluidez percebida.

**Entrega esperada:**  
> Relatório de testes (`docs/ux-testes-config-fiscal.md`) com conclusões e melhorias sugeridas.

---

## 🧠 4. Microcopy (Textos e Mensagens)
- [ ] Revisar linguagem de todos os campos e botões.
- [ ] Padronizar mensagens de erro e sucesso (✅/⚠️/❌).
- [ ] Evitar jargões técnicos (ex.: substituir “CFOP inválido” por “Código fiscal incorreto, verifique o valor”).

**Entrega esperada:**  
> Tabela de microcopy (`docs/ux-textos-config-fiscal.md`).

---

## 🎛️ 5. Design System Leve (Guia Visual)
- [ ] Definir padrão de ícones e cores (verde 🟢, amarelo 🟡, cinza ⚪).
- [ ] Padronizar espaçamento, fonte e hierarquia visual.
- [ ] Criar mini guia de componentes (botões, cards, toggles, checklists).

**Entrega esperada:**  
> `imagens/docs/design/ux-guideline-config-fiscal.png` + `docs/ux-guideline-config-fiscal.md`

---

## 🗂️ 6. Documentação e Comunicação
- [ ] Atualizar Wiki e README com novos SVGs e prints dos protótipos.
- [ ] Referenciar os PlantUMLs renderizados:

  ```markdown
  ![UX Console 360°](https://raw.githubusercontent.com/YuriDevBR/MEGASIMONEPAINEL/main/imagens/docs/diagrams/configuracao-fiscal-console360.svg)
  ![UX Wizard](https://raw.githubusercontent.com/YuriDevBR/MEGASIMONEPAINEL/main/imagens/docs/diagrams/configuracao-fiscal-wizard.svg)

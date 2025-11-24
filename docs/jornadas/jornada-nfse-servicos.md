🧭 Jornada 4 — NFS-e (Serviços / ISS)
🎯 Objetivo

Mapear a configuração e emissão de NFS-e por município (ISS), com credenciais municipais, códigos de serviço (LC 116), alíquota, e retenções (ISS/INSS/IR/PIS/COFINS/CSLL) quando aplicáveis.

👤 Perfis
Papel	Escopo	Permissões
Administrador da Empresa	Configuração municipal	Credenciais NFS-e, alíquotas, regras de retenção
Fiscal/Operador	Emissão de NFS-e	Emitir, cancelar, enviar RPS/NFS-e
Financeiro	Recebimentos	Contas a receber e conciliação
🔹 Jornada resumida

Configuração municipal:

Selecionar município e provedor (ABRASF/GINFES/Outros)

Informar credenciais (token/usuário/senha/certificado, conforme município)

Código de serviço (LC 116), alíquota ISS, natureza da operação

Regras de retenção (marcar se há retenção e quais tributos)

Teste de conexão (homologação/produção)

Emissão NFS-e:

Cliente (normalmente tomador PJ, com IE/IM quando aplicável)

Serviço (código + descrição), base de cálculo, deduções (se houver)

Retenções marcadas conforme contrato

Transmitir: RPS → NFS-e (sincrono/assíncrono, depende do provedor)

Pós-emissão:

Envio do documento ao tomador

Cancelamento (regras por município)

Financeiro:

Contas a receber, baixas, relatórios de ISS
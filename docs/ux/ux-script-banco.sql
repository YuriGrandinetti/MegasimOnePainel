-- ================================
-- CRIAÇÃO DE TABELAS NOVAS
-- ================================
BEGIN;

-- 1) Certificado A1 (reusado em NF-e e NFS-e)
CREATE TABLE IF NOT EXISTS public.certificadoa1 (
    tenant_id           uuid        NOT NULL,
    cert_id             uuid        NOT NULL, -- gerado pela app
    armazenamento_ref   varchar(200) NOT NULL, -- caminho seguro / vault id
    alias               varchar(120),
    validade            date,
    criado_em           timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT pk_certificadoa1 PRIMARY KEY (tenant_id, cert_id)
);

COMMENT ON TABLE public.certificadoa1 IS 'Repositório de certificados A1 por tenant';
COMMENT ON COLUMN public.certificadoa1.armazenamento_ref IS 'Referência segura para o arquivo (ex.: storage/vault)';


-- 2) Configuração de NF-e (modelo 55) por estabelecimento
CREATE TABLE IF NOT EXISTS public.nfeconfig (
    tenant_id           uuid        NOT NULL,
    estabelecimento_id  integer     NOT NULL,
    ambiente            varchar(20) NOT NULL, -- 'homolog'|'producao'
    serie               varchar(4)  NOT NULL,
    prox_numero         bigint      NOT NULL,
    cert_tenant_id      uuid,                -- FK composta para certificado (mesmo tenant_id)
    cert_id             uuid,
    certificado_alias   varchar(120),
    certificado_ult_validacao timestamp without time zone,
    ativo               boolean     NOT NULL DEFAULT false,
    data_criacao        timestamp without time zone NOT NULL DEFAULT now(),
    data_atualizacao    timestamp without time zone,
    CONSTRAINT pk_nfeconfig PRIMARY KEY (tenant_id, estabelecimento_id),
    CONSTRAINT fk_nfeconfig_estabelecimento
        FOREIGN KEY (tenant_id, estabelecimento_id)
        REFERENCES public.estabelecimento (tenant_id, estabelecimento_id)
        ON UPDATE NO ACTION ON DELETE CASCADE,
    CONSTRAINT fk_nfeconfig_certificadoa1
        FOREIGN KEY (cert_tenant_id, cert_id)
        REFERENCES public.certificadoa1 (tenant_id, cert_id)
        ON UPDATE NO ACTION ON DELETE SET NULL,
    CONSTRAINT ck_nfeconfig_ambiente CHECK (ambiente IN ('homolog','producao'))
);

CREATE INDEX IF NOT EXISTS idx_nfeconfig_cert ON public.nfeconfig (cert_tenant_id, cert_id);


-- 3) Configuração de NFC-e (modelo 65) por estabelecimento
CREATE TABLE IF NOT EXISTS public.nfceconfig (
    tenant_id           uuid        NOT NULL,
    estabelecimento_id  integer     NOT NULL,
    ambiente            varchar(20) NOT NULL, -- 'homolog'|'producao'
    csc_id              varchar(10) NOT NULL,
    csc_token           varchar(64) NOT NULL,
    serie               varchar(4)  NOT NULL,
    prox_numero         bigint      NOT NULL,
    impressao           varchar(16) NOT NULL DEFAULT 'termica', -- 'a4'|'ecf'|'termica'
    contingencia        boolean     NOT NULL DEFAULT false,
    ativo               boolean     NOT NULL DEFAULT false,
    data_criacao        timestamp without time zone NOT NULL DEFAULT now(),
    data_atualizacao    timestamp without time zone,
    CONSTRAINT pk_nfceconfig PRIMARY KEY (tenant_id, estabelecimento_id),
    CONSTRAINT fk_nfceconfig_estabelecimento
        FOREIGN KEY (tenant_id, estabelecimento_id)
        REFERENCES public.estabelecimento (tenant_id, estabelecimento_id)
        ON UPDATE NO ACTION ON DELETE CASCADE,
    CONSTRAINT ck_nfceconfig_ambiente CHECK (ambiente IN ('homolog','producao')),
    CONSTRAINT ck_nfceconfig_impressao CHECK (impressao IN ('a4','ecf','termica'))
);


-- 4) Configuração de NFS-e (serviços) por estabelecimento
CREATE TABLE IF NOT EXISTS public.nfseconfig (
    tenant_id               uuid        NOT NULL,
    estabelecimento_id      integer     NOT NULL,
    ambiente                varchar(20) NOT NULL, -- 'homolog'|'producao'
    inscricao_municipal     varchar(20) NOT NULL,
    codigo_municipio_ibge   integer     NOT NULL,
    provedor                varchar(24) NOT NULL, -- 'ABRASF','Betha','ISSNet','Ginfes','Outros'
    rps_serie               varchar(5)  NOT NULL,
    rps_prox_numero         bigint      NOT NULL,
    cnae                    varchar(10),
    item_lista_servico      varchar(10),
    aliquota_iss            numeric(5,2),
    regime_municipal        varchar(16), -- 'normal','simples','mei','outros'
    credencial_login        varchar(120),
    credencial_token        varchar(200),
    cert_tenant_id          uuid,           -- opcional: algumas prefeituras usam A1
    cert_id                 uuid,
    ativo                   boolean     NOT NULL DEFAULT false,
    data_criacao            timestamp without time zone NOT NULL DEFAULT now(),
    data_atualizacao        timestamp without time zone,
    CONSTRAINT pk_nfseconfig PRIMARY KEY (tenant_id, estabelecimento_id),
    CONSTRAINT fk_nfseconfig_estabelecimento
        FOREIGN KEY (tenant_id, estabelecimento_id)
        REFERENCES public.estabelecimento (tenant_id, estabelecimento_id)
        ON UPDATE NO ACTION ON DELETE CASCADE,
    CONSTRAINT fk_nfseconfig_certificadoa1
        FOREIGN KEY (cert_tenant_id, cert_id)
        REFERENCES public.certificadoa1 (tenant_id, cert_id)
        ON UPDATE NO ACTION ON DELETE SET NULL,
    CONSTRAINT ck_nfseconfig_ambiente CHECK (ambiente IN ('homolog','producao')),
    CONSTRAINT ck_nfseconfig_provedor CHECK (provedor IN ('ABRASF','Betha','ISSNet','Ginfes','Outros')),
    CONSTRAINT ck_nfseconfig_regime CHECK (regime_municipal IN ('normal','simples','mei','outros'))
);

CREATE INDEX IF NOT EXISTS idx_nfseconfig_cert ON public.nfseconfig (cert_tenant_id, cert_id);


-- ================================
-- AJUSTES NÃO-DESTRUTIVOS NAS TABELAS EXISTENTES
-- ================================

-- 5) Sinalizar depreciação do csc no estabelecimento (migração suave)
DO $$
BEGIN
    -- Apenas comenta se a coluna existir
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'estabelecimento'
          AND column_name = 'csc'
    ) THEN
        COMMENT ON COLUMN public.estabelecimento.csc IS
        'DEPRECADO: use public.nfceconfig (csc_id, csc_token). Mantido provisoriamente para compatibilidade.';
    END IF;
END $$;

-- 6) (Opcional) Flags de uso por tipo na tabela estabelecimento
--    Se quiser refletir o status "usa_nfe" / "usa_nfce" / "usa_nfse" na UI.
ALTER TABLE IF EXISTS public.estabelecimento
    ADD COLUMN IF NOT EXISTS usa_nfce boolean,
    ADD COLUMN IF NOT EXISTS usa_nfse boolean;

-- ================================
-- MIGRAÇÃO SUAVE (DADOS LEGADOS)
-- ================================

-- 7) Migrar CSC legado do estabelecimento para a nfceconfig (somente onde não existir)
--    Supondo defaults razoáveis: ambiente=producao, serie='1', prox_numero=1
INSERT INTO public.nfceconfig (
    tenant_id, estabelecimento_id, ambiente, csc_id, csc_token, serie, prox_numero, impressao, contingencia, ativo
)
SELECT
    e.tenant_id,
    e.estabelecimento_id,
    'producao' AS ambiente,
    -- Se você guardava tudo no campo 'csc', pode duplicar como id e token até
    -- a equipe preencher corretamente. Recomenda-se revisar manualmente depois.
    COALESCE(NULLIF(e.csc,''), '000001') AS csc_id,
    COALESCE(NULLIF(e.csc,''), 'TOKEN_PREENCHER') AS csc_token,
    COALESCE(NULLIF(e.versao_aplicativo,''),'1')::varchar(4) AS serie, -- reaproveito campo leve p/ default
    1::bigint AS prox_numero,
    'termica' AS impressao,
    false AS contingencia,
    false AS ativo
FROM public.estabelecimento e
LEFT JOIN public.nfceconfig n ON n.tenant_id = e.tenant_id AND n.estabelecimento_id = e.estabelecimento_id
WHERE n.tenant_id IS NULL;

-- 8) Marcar flags de uso conforme existência de configs
UPDATE public.estabelecimento es
SET usa_nfe  = TRUE
FROM public.nfeconfig nfe
WHERE nfe.tenant_id = es.tenant_id AND nfe.estabelecimento_id = es.estabelecimento_id;

UPDATE public.estabelecimento es
SET usa_nfce = TRUE
FROM public.nfceconfig nfc
WHERE nfc.tenant_id = es.tenant_id AND nfc.estabelecimento_id = es.estabelecimento_id;

UPDATE public.estabelecimento es
SET usa_nfse = TRUE
FROM public.nfseconfig nfs
WHERE nfs.tenant_id = es.tenant_id AND nfs.estabelecimento_id = es.estabelecimento_id;

COMMIT;

-- ================================
-- VIEWS PARA A UX (LEITURA UNIFICADA)
-- ================================

-- 9) View unificada para a tela "Configuração Fiscal" (por estabelecimento)
CREATE OR REPLACE VIEW public.vw_config_fiscal_estabelecimento AS
SELECT
    es.tenant_id,
    es.estabelecimento_id,
    em.empresa_id,
    em.cgc AS cnpj,
    em.razao_social,
    em.nome_fant,
    -- NF-e
    nfe.ambiente      AS nfe_ambiente,
    nfe.serie         AS nfe_serie,
    nfe.prox_numero   AS nfe_prox_numero,
    nfe.ativo         AS nfe_ativo,
    -- NFC-e
    nfc.ambiente      AS nfce_ambiente,
    nfc.csc_id        AS nfce_csc_id,
    nfc.serie         AS nfce_serie,
    nfc.prox_numero   AS nfce_prox_numero,
    nfc.impressao     AS nfce_impressao,
    nfc.ativo         AS nfce_ativo,
    -- NFS-e
    nfs.ambiente      AS nfse_ambiente,
    nfs.inscricao_municipal,
    nfs.codigo_municipio_ibge,
    nfs.provedor      AS nfse_provedor,
    nfs.rps_serie,
    nfs.rps_prox_numero,
    nfs.ativo         AS nfse_ativo
FROM public.estabelecimento es
JOIN public.empresa em
  ON em.tenant_id = es.tenant_id AND em.empresa_id = es.empresa_id
LEFT JOIN public.nfeconfig  nfe ON nfe.tenant_id = es.tenant_id AND nfe.estabelecimento_id = es.estabelecimento_id
LEFT JOIN public.nfceconfig nfc ON nfc.tenant_id = es.tenant_id AND nfc.estabelecimento_id = es.estabelecimento_id
LEFT JOIN public.nfseconfig nfs ON nfs.tenant_id = es.tenant_id AND nfs.estabelecimento_id = es.estabelecimento_id;

COMMENT ON VIEW public.vw_config_fiscal_estabelecimento IS
'Tela UX: resumo por estabelecimento das configurações NF-e, NFC-e e NFS-e';


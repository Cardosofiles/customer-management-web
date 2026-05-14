-- CreateEnum
CREATE TYPE "TipoCampanha" AS ENUM ('CAMPANHA', 'EVENTO', 'ACAO', 'ANIVERSARIO');

-- CreateEnum
CREATE TYPE "StatusCampanha" AS ENUM ('RASCUNHO', 'ENVIANDO', 'ENVIADA', 'FALHA');

-- CreateEnum
CREATE TYPE "PublicoCampanha" AS ENUM ('TODOS', 'PESSOA_FISICA', 'PESSOA_JURIDICA');

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "tipo" "TipoCampanha" NOT NULL,
    "status" "StatusCampanha" NOT NULL DEFAULT 'RASCUNHO',
    "publico" "PublicoCampanha" NOT NULL DEFAULT 'TODOS',
    "totalEnvios" INTEGER NOT NULL DEFAULT 0,
    "totalFalhas" INTEGER NOT NULL DEFAULT 0,
    "enviadaEm" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_sends" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'sent',
    "error" TEXT,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaign_sends_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "campaign_sends_campaignId_idx" ON "campaign_sends"("campaignId");

-- AddForeignKey
ALTER TABLE "campaign_sends" ADD CONSTRAINT "campaign_sends_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

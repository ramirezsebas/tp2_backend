/*
  Warnings:

  - You are about to drop the column `horaCierra` on the `ConsumoMesa` table. All the data in the column will be lost.
  - You are about to drop the column `horaCreacion` on the `ConsumoMesa` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ConsumoMesa" DROP COLUMN "horaCierra",
DROP COLUMN "horaCreacion",
ALTER COLUMN "fechaCierra" DROP NOT NULL;

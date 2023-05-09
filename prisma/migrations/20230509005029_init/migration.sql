/*
  Warnings:

  - Added the required column `id_restaurante` to the `Reserva` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reserva" ADD COLUMN     "id_restaurante" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_id_restaurante_fkey" FOREIGN KEY ("id_restaurante") REFERENCES "Restaurante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

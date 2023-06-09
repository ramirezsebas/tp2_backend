/*
  Warnings:

  - You are about to drop the column `id_producto` on the `ConsumoMesa` table. All the data in the column will be lost.
  - Added the required column `id_consumo_mesa` to the `Producto` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ConsumoMesa" DROP CONSTRAINT "ConsumoMesa_id_producto_fkey";

-- AlterTable
ALTER TABLE "ConsumoMesa" DROP COLUMN "id_producto";

-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "id_consumo_mesa" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_id_consumo_mesa_fkey" FOREIGN KEY ("id_consumo_mesa") REFERENCES "ConsumoMesa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

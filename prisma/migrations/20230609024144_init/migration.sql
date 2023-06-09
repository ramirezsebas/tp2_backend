/*
  Warnings:

  - You are about to drop the column `id_consumo_mesa` on the `Producto` table. All the data in the column will be lost.
  - Added the required column `id_producto` to the `ConsumoMesa` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Producto" DROP CONSTRAINT "Producto_id_consumo_mesa_fkey";

-- AlterTable
ALTER TABLE "ConsumoMesa" ADD COLUMN     "id_producto" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Producto" DROP COLUMN "id_consumo_mesa";

-- CreateTable
CREATE TABLE "_ConsumoMesaToProducto" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ConsumoMesaToProducto_AB_unique" ON "_ConsumoMesaToProducto"("A", "B");

-- CreateIndex
CREATE INDEX "_ConsumoMesaToProducto_B_index" ON "_ConsumoMesaToProducto"("B");

-- AddForeignKey
ALTER TABLE "_ConsumoMesaToProducto" ADD CONSTRAINT "_ConsumoMesaToProducto_A_fkey" FOREIGN KEY ("A") REFERENCES "ConsumoMesa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConsumoMesaToProducto" ADD CONSTRAINT "_ConsumoMesaToProducto_B_fkey" FOREIGN KEY ("B") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

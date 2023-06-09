/*
  Warnings:

  - You are about to drop the column `cantidad` on the `ConsumoMesa` table. All the data in the column will be lost.
  - You are about to drop the column `id_producto` on the `ConsumoMesa` table. All the data in the column will be lost.
  - You are about to drop the `_ConsumoMesaToProducto` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ConsumoMesaToProducto" DROP CONSTRAINT "_ConsumoMesaToProducto_A_fkey";

-- DropForeignKey
ALTER TABLE "_ConsumoMesaToProducto" DROP CONSTRAINT "_ConsumoMesaToProducto_B_fkey";

-- AlterTable
ALTER TABLE "ConsumoMesa" DROP COLUMN "cantidad",
DROP COLUMN "id_producto";

-- DropTable
DROP TABLE "_ConsumoMesaToProducto";

-- CreateTable
CREATE TABLE "DetalleConsumo" (
    "id" SERIAL NOT NULL,
    "id_consumo_mesa" INTEGER NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DetalleConsumo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DetalleConsumo" ADD CONSTRAINT "DetalleConsumo_id_consumo_mesa_fkey" FOREIGN KEY ("id_consumo_mesa") REFERENCES "ConsumoMesa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleConsumo" ADD CONSTRAINT "DetalleConsumo_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

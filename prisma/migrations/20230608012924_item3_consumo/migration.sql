-- CreateTable
CREATE TABLE "ConsumoMesa" (
    "id" SERIAL NOT NULL,
    "id_mesa" INTEGER NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "id_restaurante" INTEGER NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'abierto',
    "total" DOUBLE PRECISION NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "horaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaCierra" TIMESTAMP(3) NOT NULL,
    "horaCierra" TIMESTAMP(3) NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "ConsumoMesa_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ConsumoMesa" ADD CONSTRAINT "ConsumoMesa_id_mesa_fkey" FOREIGN KEY ("id_mesa") REFERENCES "Mesa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsumoMesa" ADD CONSTRAINT "ConsumoMesa_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsumoMesa" ADD CONSTRAINT "ConsumoMesa_id_restaurante_fkey" FOREIGN KEY ("id_restaurante") REFERENCES "Restaurante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsumoMesa" ADD CONSTRAINT "ConsumoMesa_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "CategoriaProducto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "CategoriaProducto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "id_categoria" INTEGER NOT NULL,
    "precio_venta" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "CategoriaProducto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

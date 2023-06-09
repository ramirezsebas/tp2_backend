// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method; const {
        id_mesa,
        id_restaurante,
        total,
        DetalleConsumo,
    } = req.body;
    const { id } = req.query;

    const parsedId = Number(id);
    const isIdInteger = isNaN(parsedId);
    const detalle = DetalleConsumo;

    if (isIdInteger) {
        res.status(400).json({ message: "El id debe ser un numero entero" });
        return;
    }

    switch (method) {
        case "PATCH":
        case "PUT":
            const { id_mesa, id_restaurante, id_cliente, DetalleConsumo, estado } = req.body;

            // Update ConsumoMesa

            try {

                console.log("DetalleConsumo");
                console.log(DetalleConsumo);


                if (estado) {
                    const updatedConsumoMesa = await prisma.consumoMesa.update({
                        where: { id: parsedId }, // Assuming you have the ID as a URL parameter
                        data: {
                            estado: estado
                        },
                        include: {
                            DetalleConsumo: true,
                            mesa: true,
                            cliente: true,
                            restaurante: true,
                        },
                    });

                    res.status(200).json(updatedConsumoMesa);
                    return;
                }

                if (!DetalleConsumo) {
                    const updatedConsumoMesa = await prisma.consumoMesa.update({
                        where: { id: parsedId }, // Assuming you have the ID as a URL parameter
                        data: {
                            cliente: { connect: { id: Number(id_cliente) } },
                        },
                        include: {
                            DetalleConsumo: true,
                            mesa: true,
                            cliente: true,
                            restaurante: true,
                        },
                    });
                    res.status(200).json(updatedConsumoMesa);
                    return;

                }
                const updatedConsumoMesa = await prisma.consumoMesa.update({
                    where: { id: parsedId }, // Assuming you have the ID as a URL parameter
                    data: {
                        mesa: { connect: { id: Number(id_mesa) } },
                        restaurante: { connect: { id: Number(id_restaurante) } },
                        cliente: { connect: { id: Number(id_cliente) } },
                        DetalleConsumo: {
                            create: {
                                producto: { connect: { id: Number(DetalleConsumo.id_producto) } },
                                cantidad: Number(DetalleConsumo.cantidad),
                                total: Number(DetalleConsumo.total),
                                precio: Number(DetalleConsumo.precio),
                            },
                        },
                    },
                    include: {
                        DetalleConsumo: true,
                        mesa: true,
                        cliente: true,
                        restaurante: true,
                    },
                });

                res.status(200).json(updatedConsumoMesa);
            } catch (error) {
                console.log(error);
                res.status(400).json(error);

            }

            break;
        case "DELETE":
            prisma.consumoMesa
                .findFirst({
                    where: {
                        id: parseInt(id as string),
                    },
                })
                .then((data) => {
                    if (!data) {
                        res.status(400).json({ message: "El consumoMesa no existe" });
                        return;
                    }
                    prisma.consumoMesa
                        .delete({
                            where: {
                                id: parseInt(id as string),
                            },
                        })
                        .then((data) => {
                            res.status(200).json(data);
                        });
                });

            break;
    }
}

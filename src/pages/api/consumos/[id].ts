// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method; const {
        id_mesa,
        id_cliente,
        id_restaurante,
        total
    } = req.body;
    const { id } = req.query;

    const parsedId = Number(id);
    const isIdInteger = isNaN(parsedId);

    if (isIdInteger) {
        res.status(400).json({ message: "El id debe ser un numero entero" });
        return;
    }

    switch (method) {
        case "PATCH":
        case "PUT":
            if (!id_mesa && !id_cliente && !id_restaurante && total == null) {
                res
                    .status(400)
                    .json({ message: "Por favor ingresa nombre, precio o categoria" });
                return;
            }

            let consumoMesa = prisma.consumoMesa
                .findFirst({
                    where: {
                        id: parseInt(id as string),
                    },
                    include: {
                        DetalleConsumo: true,
                    },
                })
                .then((data) => {
                    if (!data) {
                        res.status(400).json({ message: "El consumoMesa no existe" });
                        return;
                    }

                    prisma.consumoMesa
                        .findFirst({
                            where: {
                                id: parseInt(id as string),
                            },
                            include: {
                                DetalleConsumo: true,
                            },
                        })
                        .then((data) => {
                            if (!data) {
                                res.status(400).json({ message: "El consumoMesa no existe" });
                                return;
                            }
                            prisma.consumoMesa
                                .update({
                                    where: {
                                        id: parseInt(id as string),
                                    },
                                    data: {
                                        mesa: {
                                            connect: {
                                                id: parseInt(id_mesa)
                                            },
                                        },
                                        cliente: {
                                            connect: {
                                                id: parseInt(id_cliente)
                                            },
                                        },
                                        restaurante: {
                                            connect: {
                                                id: parseInt(id_restaurante)
                                            },
                                        },
                                        total: parseFloat(total),
                                    },
                                })
                                .then((data) => {
                                    res.status(200).json(data);
                                });
                        });
                });

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

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  const { id_mesa, id_cliente, id_restaurante, total, DetalleConsumo } =
    req.body;

  console.log(req.body);
  let detalle = DetalleConsumo;

  switch (method) {
    case "GET":
      prisma.consumoMesa
        .findMany({
          include: {
            DetalleConsumo: {
              include: {
                producto: true,
              },
            },
            mesa: true,
            cliente: true,
            restaurante: true,

          },
        })
        .then((data) => {
          res.status(200).json(data);
        });
      break;
    case "POST":
      console.log(req.body);
      if (
        !id_mesa ||
        !id_cliente ||
        !id_restaurante ||
        total == null ||
        DetalleConsumo?.length == 0
      ) {
        res.status(400).json({
          message:
            "Por favor ingresa id_mesa, id_cliente, id_restaurante, total",
        });
        return;
      }

      prisma.consumoMesa
        .create({
          data: {
            mesa: {
              connect: {
                id: parseInt(id_mesa),
              },
            },
            cliente: {
              connect: {
                id: parseInt(id_cliente),
              },
            },
            restaurante: {
              connect: {
                id: parseInt(id_restaurante),
              },
            },
            total: parseFloat(total),
            DetalleConsumo: {
              create: {
                producto: { connect: { id: Number(detalle.id_producto) } },
                cantidad: Number(detalle.cantidad),
                precio: Number(detalle.precio),
                total: Number(detalle.total),
              },
            },
          },
        })
        .then((data) => {
          console.log(data);
          res.status(201).json(data);
        })
        .catch((error) => {
          console.log(error);
          res.status(400).json(error);
        });

      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Metodo ${method} no permitido`);
  }
}

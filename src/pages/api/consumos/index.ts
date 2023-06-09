// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  const {
    id_mesa,
    id_cliente,
    id_restaurante,
    total
  } = req.body;

  switch (method) {
    case "GET":
      prisma.consumoMesa.findMany({
        include: {
          DetalleConsumo: true
        }
      }).then((data) => {
        res.status(200).json(data);
      });
      break;
    case "POST":
      console.log(req.body);
      if (!id_mesa || !id_cliente || !id_restaurante || total == null) {
        res
          .status(400)
          .json({
            message: "Por favor ingresa id_mesa, id_cliente, id_restaurante, total"
          });
        return;
      }

      prisma.consumoMesa
        .create({
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
        })
        .catch((error) => {
          res.status(400).json(error);
        });



      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Metodo ${method} no permitido`);
  }
}

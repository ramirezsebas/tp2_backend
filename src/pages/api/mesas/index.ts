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
    nombre,
    direccion,
    posicion_x,
    posicion_y,
    planta,
    capacidad,
    id_restaurante,
  } = req.body;

  switch (method) {
    case "GET":
      prisma.mesa.findMany().then((data) => {
        res.status(200).json(data);
      });
      break;
    case "POST":
      if (
        !nombre ||
        !direccion ||
        !posicion_x ||
        !posicion_y ||
        !planta ||
        !capacidad
      ) {
        res.status(400).json({
          message:
            "Por favor ingresa nombre, direccion, posicion_x, posicion_y , planta e capacidad",
        });
        return;
      }

      if (!id_restaurante) {
        res.status(400).json({
          message: "Por favor ingresa el id del restaurante",
        });
        return;
      }

      let restaurannte = await prisma.restaurante.findFirst({
        where: {
          id: parseInt(id_restaurante),
        },
      });

      if (restaurannte) {
        res.status(400).json({
          message: "El restaurante ya existe",
        });
        return;
      }

      prisma.mesa
        .create({
          data: {
            nombre: req.body.nombre,
            direccion: req.body.direccion,
            posicion_x: req.body.posicion_x,
            posicion_y: req.body.posicion_y,
            planta: req.body.planta,
            capacidad: req.body.capacidad,
            restaurante: {
              connect: {
                id: parseInt(id_restaurante),
              },
            },
          },
        })
        .then((data) => {
          res.status(200).json(data);
        });
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Metodo ${method} no permitido`);
  }
}

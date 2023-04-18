// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;
  const { nombre, direccion, posicion_x, posicion_y, planta, capacidad } =
    req.body;
  const { id } = req.query;

  switch (method) {
    case "GET":
      prisma.mesa
        .findMany({
          where: {
            id: parseInt(id as string),
          },
        })
        .then((data) => {
          res.status(200).json(data);
        });
      break;
    case "PATCH":
    case "PUT":
      if (
        !nombre &&
        !direccion &&
        !posicion_x &&
        !posicion_y &&
        !planta &&
        !capacidad
      ) {
        res.status(400).json({
          message:
            "Por favor ingresa nombre, direccion, posicion_x, posicion_y, planta y capacidad",
        });
        return;
      }

      prisma.mesa
        .update({
          where: {
            id: parseInt(id as string),
          },
          data: {
            nombre: req.body.nombre,
            direccion: req.body.direccion,
            posicion_x: req.body.posicion_x,
            posicion_y: req.body.posicion_y,
            planta: req.body.planta,
            capacidad: req.body.capacidad,
          },
        })
        .then((data) => {
          res.status(200).json(data);
        });

      break;
    case "DELETE":
      prisma.mesa
        .delete({
          where: {
            id: parseInt(id as string),
          },
        })
        .then((data) => {
          res.status(200).json(data);
        });
      break;
  }
}

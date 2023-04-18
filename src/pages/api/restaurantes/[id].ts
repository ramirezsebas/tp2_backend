import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;
  const { nombre, direccion } = req.body;
  const { id } = req.query;

  switch (method) {
    case "GET":
      prisma.restaurante
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
      if (!nombre && !direccion) {
        res
          .status(400)
          .json({ message: "Por favor ingresa nombre, direccion o ambos" });
        return;
      }

      prisma.restaurante
        .update({
          where: {
            id: parseInt(id as string),
          },
          data: {
            nombre: req.body.nombre,
            direccion: req.body.direccion,
          },
        })
        .then((data) => {
          res.status(200).json(data);
        });

      break;
    case "DELETE":
      prisma.restaurante
        .delete({
          where: {
            id: parseInt(id as string),
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

import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;
  const { nombre, direccion } = req.body;

  switch (method) {
    case "GET":
      prisma.restaurante.findMany().then((data) => {
        res.status(200).json(data);
      });
      break;
    case "POST":
      if (!nombre || !direccion) {
        res
          .status(400)
          .json({ message: "Por favor ingresa nombre y direccion" });
        return;
      }

      prisma.restaurante
        .create({
          data: {
            nombre: nombre,
            direccion: direccion,
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

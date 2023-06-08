// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;
  const { nombre } = req.body;

  switch (method) {
    case "GET":
      prisma.categoriaProducto.findMany().then((data) => {
        res.status(200).json(data);
      });
      break;
    case "POST":
      if (!nombre) {
        res.status(400).json({ message: "Por favor ingresa nombre" });
        return;
      }

      prisma.categoriaProducto
        .create({
          data: {
            nombre: nombre,
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

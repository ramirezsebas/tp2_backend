// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  const { nombre, categoria, precio } = req.body;

  switch (method) {
    case "GET":
      prisma.consumoMesa.findMany({}).then((data) => {
        res.status(200).json(data);
      });
      break;
    case "POST":
      if (!nombre || !categoria || !precio) {
        res
          .status(400)
          .json({ message: "Por favor ingresa nombre, categoria y precio" });
        return;
      }

      let categoriaFound = prisma.categoriaProducto
        .findFirst({
          where: {
            id: parseInt(categoria as string),
          },
        })
        .then((categoriaFound) => {
          if (!categoriaFound) {
            res.status(400).json({ message: "La categoria no existe" });
            return;
          }

          prisma.consumoMesa
            .create({
              data: {
                nombre: nombre,
                precio_venta: Number(precio),
                categoria: {
                  connect: {
                    id: parseInt(categoria as string),
                  },
                },
              },
            })

            .then((data) => {
              console.log("data");
              console.log(data);
              res.status(200).json(data);
            })
            .catch((error) => {
              res.status(400).json({ message: error.message });
            });
        })
        .catch((error) => {
          res.status(400).json({ message: error.message });
        });

      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Metodo ${method} no permitido`);
  }
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;
  const { nombre } = req.body;
  const { id } = req.query;

  const parsedId = Number(id);
  const isIdInteger = isNaN(parsedId);

  if (isIdInteger) {
    res.status(400).json({ message: "El id debe ser un numero entero" });
    return;
  }

  switch (method) {
    case "GET":
      prisma.categoriaProducto
        .findMany({
          where: {
            id: parseInt(id as string),
          },
        })
        .then((data) => {
          if (data.length === 0) {
            res.status(400).json({ message: "El categoriaProducto no existe" });
            return;
          }

          res.status(200).json(data[0]);
        });
      break;
    case "PATCH":
    case "PUT":
      if (!nombre) {
        res.status(400).json({ message: "Por favor ingresa nombre" });
        return;
      }

      let categoriaProducto = prisma.categoriaProducto
        .findFirst({
          where: {
            id: parseInt(id as string),
          },
        })
        .then((data) => {
          if (!data) {
            res.status(400).json({ message: "El categoriaProducto no existe" });
            return;
          }

          prisma.categoriaProducto
            .findFirst({
              where: {
                id: parseInt(id as string),
              },
            })
            .then((data) => {
              if (!data) {
                res
                  .status(400)
                  .json({ message: "El categoriaProducto no existe" });
                return;
              }
              prisma.categoriaProducto
                .update({
                  where: {
                    id: parseInt(id as string),
                  },
                  data: {
                    nombre: req.body.nombre,
                  },
                })
                .then((data) => {
                  res.status(200).json(data);
                });
            });
        });

      break;
    case "DELETE":
      prisma.categoriaProducto

        .findFirst({
          where: {
            id: parseInt(id as string),
          },
        })
        .then((data) => {
          if (!data) {
            res.status(400).json({ message: "El categoriaProducto no existe" });
            return;
          }
          prisma.categoriaProducto
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

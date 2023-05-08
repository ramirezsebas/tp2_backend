// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;
  const { nombre, apellido, cedula } = req.body;
  const { id } = req.query;

  const parsedId = Number(id);
  const isIdInteger = isNaN(parsedId);

  if (isIdInteger) {
    res.status(400).json({ message: "El id debe ser un numero entero" });
    return;
  }

  switch (method) {
    case "GET":
      prisma.cliente
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
      if (!nombre && !apellido && !cedula) {
        res
          .status(400)
          .json({ message: "Por favor ingresa nombre, apellido o cedula" });
        return;
      }

      if (cedula) {
        prisma.cliente
          .findFirst({
            where: {
              id: parseInt(id as string),
            },
          })
          .then((data) => {
            if (!data) {
              res.status(400).json({ message: "El cliente no existe" });
              return;
            } else {
              prisma.cliente
                .update({
                  where: {
                    id: parseInt(id as string),
                  },
                  data: {
                    nombre: req.body.nombre,
                    apellido: req.body.apellido,
                    cedula: req.body.cedula,
                  },
                })
                .then((data) => {
                  res.status(200).json(data);
                });
            }
          });
      }

      break;
    case "DELETE":
      prisma.cliente
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

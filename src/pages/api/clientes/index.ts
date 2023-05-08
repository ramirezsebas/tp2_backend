// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;
  const { nombre, apellido, cedula } = req.body;

  switch (method) {
    case "GET":
      prisma.cliente.findMany().then((data) => {
        res.status(200).json(data);
      });
      break;
    case "POST":
      if (!nombre || !apellido || !cedula) {
        res
          .status(400)
          .json({ message: "Por favor ingresa nombre, apellido y cedula" });
        return;
      }

      prisma.cliente
        .findFirst({
          where: {
            cedula: req.body.cedula,
          },
        })
        .then((data) => {
          if (data) {
            res.status(400).json({ message: "El cliente ya existe" });
            return;
          } else {
            prisma.cliente
              .create({
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

      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Metodo ${method} no permitido`);
  }
}

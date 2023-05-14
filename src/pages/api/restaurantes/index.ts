import { mapPrismaClientError } from "@/errors/prisma_error";
import { PrismaClient } from "@prisma/client";
import { PrismaClientInitializationError } from "@prisma/client/runtime/library";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  const { nombre, direccion } = req.body;

  switch (method) {
    case "GET":
      try {
        let restaurantes = await prisma.restaurante.findMany({
          include: {
            reservas: true,
            mesas: true,
          },
        });
        res.status(200).json(restaurantes);
      } catch (error) {
        if (error instanceof PrismaClientInitializationError) {
          res.status(500).json({
            message: mapPrismaClientError(error.errorCode ?? ""),
          });
        } else {
          res.status(500).json(error);
        }
      }

      break;
    case "POST":
      if (!nombre || !direccion) {
        res
          .status(400)
          .json({ message: "Por favor ingresa nombre y direccion" });
        return;
      }

      try {
        let restauranteCreado = await prisma.restaurante.create({
          data: {
            nombre: nombre,
            direccion: direccion,
          },
        });

        res.status(201).json(restauranteCreado);
      } catch (error) {
        if (error instanceof PrismaClientInitializationError) {
          res.status(500).json({
            message: mapPrismaClientError(error.errorCode ?? ""),
          });
        } else {
          res.status(500).json(error);
        }
      }

      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Metodo ${method} no permitido`);
  }
}

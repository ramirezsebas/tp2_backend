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
        let restaurantes = await prisma.restaurante.findMany();
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

function mapPrismaClientError(errorCode: string) {
  switch (errorCode) {
    case "P101":
      return "La URL de la base de datos es inválida o tiene un formato incorrecto.";
    case "P102":
      return "No se pudo conectar al servidor de la base de datos o se rechazó la conexión.";
    case "P103":
      return "No se pudo autenticar con la base de datos debido a que las credenciales proporcionadas son inválidas o insuficientes.";
    case "P104":
      return "No se pudo inicializar el cliente de Prisma porque el archivo 'schema.prisma' no se encontró o tiene un formato incorrecto.";
    case "P105":
      return "No se pudo inicializar el cliente de Prisma porque hubo un error al analizar el archivo 'schema.prisma'.";
    case "P106":
      return "No se pudo inicializar el cliente de Prisma porque no se pudo generar el esquema de Prisma a partir del archivo 'schema.prisma'.";
    case "P107":
      return "No se pudo inicializar el cliente de Prisma debido a que hubo un error durante el proceso de migración de la base de datos.";
    case "P108":
      return "No se pudo inicializar el cliente de Prisma debido a que hubo un error durante el proceso de generación del cliente.";
    default:
      return "Ocurrió un error desconocido al inicializar el cliente de Prisma.";
  }
}

import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Extract from /api/restaurantes/[idRestaurante]/mesas/[idMesas]

  // const [idRestaurante,reserva mesas, idMesas] = req.query
  //   .restaurantesParams as string[];
  const params = req.query.restaurantesParams as string[];

  const idRestaurante = params[0];

  const mesas = params.find((param) => param === "mesas");

  const reservas = params.find((param) => param === "reservas");

  //Extract all numbers from params
  const numbers = params.filter((param) => !isNaN(Number(param)));

  const idMesas = numbers[1];

  console.log(req.query.restaurantesParams);

  const method = req.method;

  const parsedIdRestaurante = Number(idRestaurante);

  const isIdRestauranteInteger = isNaN(parsedIdRestaurante);

  if (isIdRestauranteInteger) {
    res.status(400).json({ message: "El id debe ser un numero entero" });
    return;
  }
  switch (method) {
    case "GET":
      // Endpoint: /api/restaurantes/[idRestaurante]/mesas/[idMesas]
      if (mesas && idMesas) {
        if (mesas !== "mesas") {
          res.status(400).json({ message: "Parametros invalidos" });
          return;
        }
        if (isNaN(Number(idMesas))) {
          res
            .status(400)
            .json({ message: "El id de la mesa debe ser un numero entero" });
          return;
        }

        let restaurante = await prisma.restaurante.findMany({
          where: {
            id: parseInt(idRestaurante),
          },
        });

        if (restaurante.length === 0) {
          res.status(400).json({
            message: `No se encontro el restaurante ${idRestaurante}`,
          });
          return;
        }

        prisma.mesa
          .findMany({
            where: {
              id: parseInt(idMesas),
              id_restaurante: parseInt(idRestaurante),
            },
          })
          .then((data) => {
            if (data.length === 0) {
              res
                .status(400)
                .json({ message: `No se encontro la mesa ${idMesas}` });
            } else {
              res.status(200).json(data[0]);
            }
          })
          .catch((error) => {
            res

              .status(500)
              .json({ message: `No se encontro la mesa ${idMesas}` });
          });
        return;
      }

      // Endpoint: /api/restaurantes/[idRestaurante]/mesas
      if (mesas && !idMesas) {
        if (mesas !== "mesas") {
          res.status(400).json({ message: "Parametros invalidos" });
          return;
        }
        prisma.mesa
          .findMany({
            where: {
              id_restaurante: parseInt(idRestaurante),
            },
          })
          .then((data) => {
            res.status(200).json(data);
          })
          .catch((error) => {
            res.status(500).json({
              message: `No se encontro el restaurante ${idRestaurante}`,
            });
          });

        break;
      }

      // Endpoint: /api/restaurantes/[idRestaurante]
      if (!mesas && !idMesas && !reservas) {
        prisma.restaurante
          .findMany({
            where: {
              id: parseInt(idRestaurante),
            },
          })
          .then((data) => {
            if (data.length === 0) {
              res.status(400).json({
                message: `No se encontro el restaurante ${idRestaurante}`,
              });
            } else {
              res.status(200).json(data[0]);
            }
          })
          .catch((error) => {
            res.status(500).json({
              message: `No se encontro el restaurante ${idRestaurante}`,
            });
          });

        break;
      }

      // Endpoint: /api/restaurantes/[idRestaurante]/reservas
      if (reservas && !mesas && !idMesas) {
        prisma.reserva
          .findMany({
            where: {
              id_restaurante: parseInt(idRestaurante),
            },
          })
          .then((data) => {
            res.status(200).json(data);
          })
          .catch((error) => {
            res.status(500).json({
              message: `No se encontro el restaurante ${idRestaurante}`,
            });
          });
      }
      break;

    case "POST":
      // Endpoint: /api/restaurantes/[idRestaurante]/mesas
      if (mesas && !idMesas) {
        if (mesas !== "mesas") {
          res.status(400).json({ message: "Parametros invalidos" });
          return;
        }
        const { capacidad, direccion, nombre, posicion_x, planta, posicion_y } =
          req.body;

        if (
          !nombre ||
          !direccion ||
          !posicion_x ||
          !posicion_y ||
          !planta ||
          !capacidad
        ) {
          res.status(400).json({
            message:
              "Por favor ingresa nombre, direccion, posicion_x, posicion_y , planta e capacidad",
          });
          return;
        }

        let restaurannte = await prisma.restaurante.findFirst({
          where: {
            id: parseInt(idRestaurante),
          },
        });

        if (!restaurannte) {
          res.status(400).json({
            message: "El restaurante no existe",
          });
          return;
        }

        let posicionX = Number(posicion_x);
        let posicionY = Number(posicion_y);
        let capacidadMesa = Number(capacidad);
        let plantaMesa = Number(planta);

        if (isNaN(posicionX)) {
          res.status(400).json({
            message: "La posicion x debe ser un numero",
          });
          return;
        }

        if (isNaN(posicionY)) {
          res.status(400).json({
            message: "La posicion y debe ser un numero",
          });
          return;
        }

        if (isNaN(capacidadMesa)) {
          res.status(400).json({
            message: "La capacidad debe ser un numero",
          });
          return;
        }

        if (isNaN(plantaMesa)) {
          res.status(400).json({
            message: "La planta debe ser un numero",
          });
          return;
        }

        prisma.mesa
          .create({
            data: {
              nombre: nombre,
              direccion: direccion,
              posicion_x: posicionX,
              posicion_y: posicionY,
              planta: plantaMesa,
              capacidad: capacidadMesa,
              restaurante: {
                connect: {
                  id: parseInt(idRestaurante),
                },
              },
            },
          })
          .then((data) => {
            res.status(200).json(data);
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({
              message: "Error al crear la mesa",
              error: error,
            });
          });
      }

      if (reservas && !mesas && !idMesas) {
        const { id_mesa, id_cliente, fecha, hora_fin, hora_inicio, cantidad } =
          req.body;

        if (
          !id_mesa ||
          !id_cliente ||
          !fecha ||
          !hora_inicio ||
          !hora_fin ||
          !cantidad
        ) {
          res.status(400).json({
            message:
              "Por favor ingresa id_mesa, id_cliente, fecha, hora_inicio, hora_fin y cantidad",
          });
          return;
        }

        let mesa = await prisma.mesa.findFirst({
          where: {
            id: parseInt(id_mesa),
          },
        });

        if (!mesa) {
          res.status(400).json({
            message: "La mesa no existe",
          });
          return;
        }

        if (mesa.capacidad < parseInt(cantidad)) {
          res.status(400).json({
            message:
              "La cantidad de personas es mayor a la capacidad de la mesa",
          });
          return;
        }

        let cliente = await prisma.cliente.findFirst({
          where: {
            id: parseInt(id_cliente),
          },
        });

        if (!cliente) {
          res.status(400).json({
            message: "El cliente no existe",
          });
          return;
        }
        //dd/mm/yyyy
        let fechaReserva = new Date(fecha);
        // Create a regex expression to validate the time hh:mm for 24 hour format.
        let timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

        // Validate the time format.
        if (!timeRegex.test(hora_inicio)) {
          res.status(400).json({
            message: "La hora de inicio debe ser una hora valida",
          });
          return;
        }

        if (!timeRegex.test(hora_fin)) {
          res.status(400).json({
            message: "La hora de fin debe ser una hora valida",
          });
          return;
        }

        if (isNaN(fechaReserva.getTime())) {
          res.status(400).json({
            message: "La fecha debe ser una fecha valida",
          });
          return;
        }

        // hora_inicio debe ser menor a hora_fin
        const [hoursInicio, minutesInicio] = hora_inicio.split(":");
        const [hoursFin, minutesFin] = hora_fin.split(":");
        const dateInicio = new Date();
        const dateFin = new Date();
        dateInicio.setHours(hoursInicio, minutesInicio, 0);
        dateFin.setHours(hoursFin, minutesFin, 0);

        if (dateInicio.getTime() >= dateFin.getTime()) {
          res.status(400).json({
            message: "La hora de inicio debe ser menor a la hora de fin",
          });
          return;
        }

        if (dateFin.getTime() < dateInicio.getTime()) {
          res.status(400).json({
            message: "La hora de fin debe ser mayor a la hora de inicio",
          });
          return;
        }

        prisma.reserva
          .create({
            data: {
              fecha: fechaReserva,
              hora_inicio: dateInicio,
              hora_fin: dateFin,
              cantidad_personas: cantidad,
              mesa: {
                connect: {
                  id: parseInt(id_mesa),
                },
              },
              restaurante: {
                connect: {
                  id: parseInt(idRestaurante),
                },
              },
              cliente: {
                connect: {
                  id: parseInt(id_cliente),
                },
              },
            },
          })
          .then((data) => {
            res.status(200).json(data);
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({
              message: "Error al crear la reserva",
              error: error,
            });
          });
      }
      break;

    case "PATCH":
    case "PUT":
      // Endpoint: /api/restaurantes/[idRestaurante]/mesas/[idMesas]
      if (mesas && idMesas) {
        if (mesas !== "mesas") {
          res.status(400).json({ message: "Parametros invalidos" });
          return;
        }
        console.log("/api/restaurantes/[idRestaurante]/mesas/[idMesas]");

        if (isNaN(Number(idMesas))) {
          res
            .status(400)
            .json({ message: "El id de la mesa debe ser un numero entero" });
          return;
        }

        const { capacidad, direccion, nombre, posicion_x, planta, posicion_y } =
          req.body;

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
              "Por favor ingresa nombre, direccion, posicion_x, posicion_y , planta e capacidad",
          });
          return;
        }

        let restaurannte = await prisma.restaurante.findFirst({
          where: {
            id: parseInt(idRestaurante),
          },
        });

        if (!restaurannte) {
          res.status(400).json({
            message: "El restaurante no existe",
          });
          return;
        }
        let posicionX = Number(posicion_x);
        let posicionY = Number(posicion_y);
        let capacidadMesa = Number(capacidad);
        let plantaMesa = Number(planta);

        if (isNaN(posicionX)) {
          res.status(400).json({
            message: "La posicion x debe ser un numero",
          });
          return;
        }

        if (isNaN(posicionY)) {
          res.status(400).json({
            message: "La posicion y debe ser un numero",
          });
          return;
        }

        if (isNaN(capacidadMesa)) {
          res.status(400).json({
            message: "La capacidad debe ser un numero",
          });
          return;
        }

        if (isNaN(plantaMesa)) {
          res.status(400).json({
            message: "La planta debe ser un numero",
          });
          return;
        }

        let mesa = await prisma.mesa.findFirst({
          where: {
            id: parseInt(idMesas),
          },
        });

        if (!mesa) {
          res.status(400).json({
            message: "La mesa no existe",
          });
          return;
        }

        prisma.mesa
          .update({
            where: {
              id: parseInt(idMesas),
            },
            data: {
              nombre: nombre,
              direccion: direccion,
              posicion_x: posicion_x,
              posicion_y: posicion_y,
              planta: planta,
              capacidad: capacidad,
            },
          })
          .then((data) => {
            res.status(200).json(data);
          })
          .catch((error) => {
            res.status(500).json({
              message: "No se pudo actualizar la mesa",
            });
          });
        return;
      }

      // Endpoint: /api/restaurantes/[idRestaurante]
      if (!mesas && !idMesas) {
        console.log("/api/restaurantes/[idRestaurante]");
        const { direccion, nombre } = req.body;

        if (!nombre && !direccion) {
          res.status(400).json({
            message: "Por favor ingresa nombre y direccion",
          });
          return;
        }

        let restaurannte = await prisma.restaurante.findFirst({
          where: {
            id: parseInt(idRestaurante),
          },
        });

        if (!restaurannte) {
          res.status(400).json({
            message: "El restaurante no existe",
          });
          return;
        }

        prisma.restaurante
          .update({
            where: {
              id: parseInt(idRestaurante),
            },
            data: {
              nombre: nombre,
              direccion: direccion,
            },
          })
          .then((data) => {
            res.status(200).json(data);
          })
          .catch((error) => {
            res.status(500).json({
              message: "No se puede actualizar el restaurante",
            });
          });
      }

      break;

    case "DELETE":
      // Endpoint: /api/restaurantes/[idRestaurante]/mesas/[idMesas]
      if (mesas && idMesas) {
        if (mesas !== "mesas") {
          res.status(400).json({ message: "Parametros invalidos" });
          return;
        }
        if (isNaN(Number(idMesas))) {
          res
            .status(400)
            .json({ message: "El id de la mesa debe ser un numero entero" });
          return;
        }

        let mesa = await prisma.mesa.findFirst({
          where: {
            id: parseInt(idMesas),
          },
        });

        if (!mesa) {
          res.status(400).json({
            message: "La mesa no existe",
          });
          return;
        }

        prisma.mesa
          .delete({
            where: {
              id: parseInt(idMesas),
            },
          })
          .then((data) => {
            res.status(200).json(data);
          })
          .catch((error) => {
            res.status(500).json({
              message: "No se puede eliminar la mesa",
            });
          });
        return;
      }

      // Endpoint: /api/restaurantes/[idRestaurante]
      if (!mesas && !idMesas) {
        let restaurannte = await prisma.restaurante.findFirst({
          where: {
            id: parseInt(idRestaurante),
          },
        });

        if (!restaurannte) {
          res.status(400).json({
            message: "El restaurante no existe",
          });
          return;
        }

        prisma.restaurante
          .delete({
            where: {
              id: parseInt(idRestaurante),
            },
          })
          .then((data) => {
            res.status(200).json(data);
          })
          .catch((error) => {
            res.status(500).json({
              message: "No se puede eliminar el restaurante",
            });
          });
        return;
      }

      break;

    default:
      res.status(400).json({ message: "Metodo no soportado" });
      break;
  }
}

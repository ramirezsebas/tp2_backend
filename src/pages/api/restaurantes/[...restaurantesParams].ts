import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Aca extraigo del url los parametros que vienen despues de /api/restaurantes/
  // Hago esta logica por que no queria usar regex xd

  // Esta es un arreglo de todo lo que viene despues de /api/restaurantes/
  const params = req.query.restaurantesParams as string[];

  const idRestaurante = params[0];

  // Verifico si viene mesas o reservas en los parametros
  const mesas = params.find((param) => param === "mesas");

  const reservas = params.find((param) => param === "reservas");

  // Verifico si viene un numero en los parametros para el id
  const numbers = params.filter((param) => !isNaN(Number(param)));

  const idMesas = numbers[1];

  const method = req.method;

  const parsedIdRestaurante = Number(idRestaurante);

  const isIdRestauranteInteger = isNaN(parsedIdRestaurante);

  if (isIdRestauranteInteger) {
    res.status(400).json({ message: "El id debe ser un numero entero" });
    return;
  }

  console.log("Peticion");
  switch (method) {
    case "GET":
      // Endpoint: /api/restaurantes/[idRestaurante]/mesas/[idMesas]
      // Endpoint: /api/restaurantes/[idRestaurante]/mesas/[idMesas]/reservas

      //Aca entra si el endpoint es /api/restaurantes/[idRestaurante]/mesas/[idMesas]/reservas
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

      // Aca entra si el endpoint es /api/restaurantes/[idRestaurante]/mesas
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

      // Aca entra si el endpoint es /api/restaurantes/[idRestaurante]
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
            include: {
              mesa: true,
              cliente: true,
              restaurante: true,
            },
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
      console.log("/api/restaurantes/[idRestaurante]/mesas");
      console.log(`/api/restaurantes/${idRestaurante}/mesas`);

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
              posicion_x: Number(posicionX),
              posicion_y: Number(posicionY),
              planta: Number(plantaMesa),
              capacidad: Number(capacidadMesa),
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
        return;
      }

      // Endpoint: /api/restaurantes/[idRestaurante]/reservas
      console.log("/api/restaurantes/[idRestaurante]/reservas");
      console.log(`/api/restaurantes/${idRestaurante}/reservas`);

      if (reservas && !mesas && !idMesas) {
        const { id_mesa, cedula, fecha, hora_fin, hora_inicio } = req.body;

        console.log(req.body);

        if (!id_mesa || !cedula || !fecha || !hora_inicio || !hora_fin) {
          return res.status(400).json({
            message:
              "Por favor ingresa id_mesa, id_cliente, fecha, hora_inicio, hora_fin y cantidad",
          });
        }

        let mesa = await prisma.mesa.findFirst({
          where: {
            id: parseInt(id_mesa),
          },
        });

        if (!mesa) {
          return res.status(400).json({
            message: "La mesa no existe",
          });
        }

        const cantidad = mesa.capacidad;

        if (mesa.capacidad < cantidad) {
          return res.status(400).json({
            message:
              "La cantidad de personas es mayor a la capacidad de la mesa",
          });
        }

        let cliente = await prisma.cliente.findFirst({
          where: {
            cedula: cedula,
          },
        });

        if (!cliente) {
          return res.status(400).json({
            message: "El cliente no existe",
          });
        }

        let fechaReserva = new Date(fecha);

        if (hora_inicio == hora_fin) {
          return res.status(400).json({
            message: "La hora de inicio y fin no pueden ser iguales",
          });
        }

        let reservass = await prisma.reserva.findMany({
          where: {
            id_mesa: parseInt(id_mesa),
            fecha: fechaReserva,
          },
        });

        reservass.filter((reserva) => {
          if (
            (new Date(hora_inicio) >= reserva.hora_inicio &&
              new Date(hora_inicio) <= reserva.hora_fin) ||
            (new Date(hora_fin) >= reserva.hora_inicio &&
              new Date(hora_fin) <= reserva.hora_fin)
          ) {
            return res.status(400).json({
              message:
                "La mesa ya esta reservada entre las" +
                reserva.hora_inicio +
                " y las " +
                reserva.hora_fin +
                " horas",
            });
          }
        });

        await prisma.reserva.create({
          data: {
            id_mesa: parseInt(id_mesa),
            id_cliente: cliente.id,
            fecha: fechaReserva,
            hora_inicio: hora_inicio,
            hora_fin: hora_fin,
            id_restaurante: mesa.id_restaurante,
            fecha_creacion: new Date(),
            cantidad_personas: cantidad,
          },
        });

        return res.status(200).json({
          message: "Reserva creada exitosamente",
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

        console.log("idRestaurante", idRestaurante);

        let restaurannte = await prisma.restaurante.findFirst({
          where: {
            id: parseInt(idRestaurante),
          },
        });

        console.log("restaurannte", restaurannte);

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

        console.log("idMesas", idMesas);

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

        console.log("mesa", mesa);

        prisma.mesa
          .update({
            where: {
              id: parseInt(idMesas),
            },
            data: {
              nombre: nombre,
              direccion: direccion,
              posicion_x: Number(posicion_x),
              posicion_y: Number(posicion_y),
              planta: Number(planta),
              capacidad: Number(capacidad),
            },
          })
          .then((data) => {
            res.status(200).json(data);
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({
              message: error.toString() ?? "No se pudo actualizar la mesa",
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
              message:
                error.toString() ?? "No se puede actualizar el restaurante",
            });
          });
      }

      break;

    case "DELETE":
      // Endpoint: /api/restaurantes/[idRestaurante]/mesas/[idMesas]
      console.log("DELETE");
      console.log("/api/restaurantes/[idRestaurante]/mesas/[idMesas]");
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

        console.log("mesa", mesa);

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
              message: error.toString() ?? "No se puede eliminar la mesa",
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
              message:
                error.toString() ?? "No se puede eliminar el restaurante",
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

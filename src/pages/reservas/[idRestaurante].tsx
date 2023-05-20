/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  Heading,
  TableCaption,
  TableContainer,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Center,
  Link,
} from "@chakra-ui/react";
import { Reserva } from "@prisma/client";
import FloatingActionButton from "@/components/floating_action_button";
import SpinnerLoading from "@/components/spinner";
import { ApiService } from "@/data/api_service";
import { MoreOptionsDialog } from "@/components/more_options_dialog";
import { useRouter } from "next/router";

enum Action {
  NONE = "NONE",
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  MORE_OPTIONS = "MORE_OPTIONS",
}

export default function Reservas() {
  const api = new ApiService();
  const router = useRouter();
  const { idRestaurante } = router.query;
  const [reservas, setReservas] = React.useState<Reserva[]>([]);
  const [loadingReservas, setLoadingReservas] = React.useState<boolean>(true);

  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const [action, setAction] = React.useState<Action>(Action.NONE);

  const [id, setId] = useState("");
  const [cantidadPersona, setCantidadPersona] = useState("");
  const [fecha, setFecha] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (action === Action.CREATE) {
        if (!cantidadPersona || !fecha) {
          setError("Todos los campos son requeridos");
          return;
        }

        const res = await api.post("/restaurantes/${idRestaurante}/reservas", {
          nombre: cantidadPersona,
          fecha: fecha,
        });

        setReservas([...reservas, res]);
      } else if (action === Action.UPDATE) {
        const res = await api.put(
          `/restaurantes/${idRestaurante}/reservas/${id}`,
          {
            nombre: cantidadPersona,
            fecha: fecha,
          }
        );

        const newReservas = reservas.map((reserva) => {
          if (reserva.id === Number(id)) {
            return res;
          }
          return reserva;
        });

        setReservas(newReservas);
      }

      resetForm();
      setAction(Action.NONE);
    } catch (error) {
      console.log(error);
      setError("Ocurrio un error al crear el reserva");
    }
  };

  function resetForm() {
    setId("");
    setCantidadPersona("");
    setFecha("");
  }

  useEffect(() => {
    if (!idRestaurante) {
      return;
    }
    setLoadingReservas(true);
    api
      .get(`/restaurantes/${idRestaurante}/reservas`)
      .then((response) => {
        setLoadingReservas(false);
        setReservas(response);
      })
      .catch((error) => {
        setLoadingReservas(false);
        setError("Ocurrio un error al obtener los reservas");
        setTimeout(() => {
          setError("");
        }, 5000);
      });
  }, [idRestaurante]);

  if (loadingReservas) {
    return <SpinnerLoading title="Cargando Reservas" />;
  }

  const body = reservas.length ? (
    <TableContainer>
      <Table variant="simple">
        <TableCaption>Reservas Disponibles</TableCaption>
        <Thead>
          <Tr>
            <Th>Cantidad de Personas</Th>
            <Th>Fecha</Th>
            <Th>Hora Inicio</Th>
            <Th>Hora Fin</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {reservas.map((reserva) => {
            console.log("reserva");
            console.log(reserva);
            return (
              <Tr key={reserva.id}>
                <Td>{reserva.cantidad_personas}</Td>
                <Td>{new Date(reserva.fecha).toISOString().split("T")[0]}</Td>
                <Td>
                  {
                    new Date(reserva.hora_inicio)
                      .toISOString()
                      .split("T")[1]
                      .split(".")[0]
                  }
                </Td>
                <Td>
                  {
                    new Date(reserva.hora_fin)
                      .toISOString()
                      .split("T")[1]
                      .split(".")[0]
                  }
                </Td>
                <Td>
                  <Button
                    colorScheme="teal"
                    variant="outline"
                    onClick={() => {
                      setAction(Action.UPDATE);
                      setId(reserva.id.toString());
                      setCantidadPersona(reserva.cantidad_personas.toString());
                      setFecha(
                        new Date(reserva.fecha)
                          .toISOString()
                          .split("T")[0]
                          .toString()
                      );
                    }}
                  >
                    Editar
                  </Button>

                  <Button
                    colorScheme="red"
                    variant="outline"
                    onClick={() => {
                      api
                        .delete(
                          `/restaurantes/${idRestaurante}/reservas/${reserva.id}`
                        )
                        .then((value) => {
                          const newReservas = reservas.filter(
                            (rest) => rest.id !== reserva.id
                          );
                          setReservas(newReservas);
                        })
                        .catch((error) => {
                          setError("Ocurrio un error al eliminar el reserva");
                          setTimeout(() => {
                            setError("");
                          }, 5000);
                        });
                    }}
                  >
                    Eliminar
                  </Button>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  ) : (
    <Center>No hay reservas</Center>
  );

  return (
    <>
      <Center>
        <Heading as="h1" size="xl">
          Reservas
        </Heading>
      </Center>
      {body}
      <FloatingActionButton
        onClick={() => {
          setAction(Action.CREATE);
          resetForm();
        }}
      />

      {error && (
        <Box position="fixed" top="0" right="0" m={4}>
          <Alert status="error">
            <AlertIcon />
            <AlertTitle mr={2}>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </Box>
      )}

      <AlertDialog
        isOpen={
          action === Action.CREATE || action === Action.UPDATE ? true : false
        }
        leastDestructiveRef={cancelRef}
        onClose={() => {
          setAction(Action.NONE);
        }}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {action === Action.CREATE ? "Crear Reserva" : "Editar Reserva"}
            </AlertDialogHeader>

            <AlertDialogBody>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl isRequired isInvalid={error.length !== 0}>
                    <FormLabel>CantidadPersona</FormLabel>
                    <Input
                      type="text"
                      placeholder="Nombre del Reserva"
                      value={cantidadPersona}
                      onChange={(e) => setCantidadPersona(e.target.value)}
                    />
                    <FormErrorMessage>{error}</FormErrorMessage>
                  </FormControl>

                  <FormControl isRequired isInvalid={error.length !== 0}>
                    <FormLabel>Fecha</FormLabel>
                    <Input
                      type="text"
                      placeholder="Ingrese fecha"
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                    />
                    <FormErrorMessage>{error}</FormErrorMessage>
                  </FormControl>
                </VStack>
              </form>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setAction(Action.NONE)}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleSubmit} ml={3}>
                {action === Action.CREATE ? "Crear" : "Actualizar"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

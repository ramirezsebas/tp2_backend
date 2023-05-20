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
import { Restaurante } from "@prisma/client";
import FloatingActionButton from "@/components/floating_action_button";
import SpinnerLoading from "@/components/spinner";
import { ApiService } from "@/data/api_service";
import { MoreOptionsDialog } from "@/components/more_options_dialog";

enum Action {
  NONE = "NONE",
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  MORE_OPTIONS = "MORE_OPTIONS",
}

export default function Restaurantes() {
  const api = new ApiService();
  const [restaurantes, setRestaurantes] = React.useState<Restaurante[]>([]);
  const [loadingRestaurantes, setLoadingRestaurantes] =
    React.useState<boolean>(true);

  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const [action, setAction] = React.useState<Action>(Action.NONE);

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [direccion, setDireccion] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (action === Action.CREATE) {
        if (!name || !direccion) {
          setError("Todos los campos son requeridos");
          return;
        }

        const res = await api.post("/restaurantes", {
          nombre: name,
          direccion: direccion,
        });

        setRestaurantes([...restaurantes, res]);
      } else if (action === Action.UPDATE) {
        const res = await api.put(`/restaurantes/${id}`, {
          nombre: name,
          direccion: direccion,
        });

        const newRestaurantes = restaurantes.map((restaurante) => {
          if (restaurante.id === Number(id)) {
            return res;
          }
          return restaurante;
        });

        setRestaurantes(newRestaurantes);
      }

      resetForm();
      setAction(Action.NONE);
    } catch (error) {
      console.log(error);
      setError("Ocurrio un error al crear el restaurante");
    }
  };

  function resetForm() {
    setId("");
    setName("");
    setDireccion("");
  }

  useEffect(() => {
    setLoadingRestaurantes(true);
    api
      .get(`/restaurantes`)
      .then((response) => {
        setLoadingRestaurantes(false);
        setRestaurantes(response);
      })
      .catch((error) => {
        setLoadingRestaurantes(false);
        setError("Ocurrio un error al obtener los restaurantes");
        setTimeout(() => {
          setError("");
        }, 5000);
      });
  }, []);

  if (loadingRestaurantes) {
    return <SpinnerLoading title="Cargando Restaurantes" />;
  }

  const body = restaurantes.length ? (
    <TableContainer>
      <Table variant="simple">
        <TableCaption>Restaurantes Disponibles</TableCaption>
        <Thead>
          <Tr>
            <Th>Nombre</Th>
            <Th>Direccion</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {restaurantes.map((restaurante) => (
            <Tr key={restaurante.id}>
              <Td>{restaurante.nombre}</Td>
              <Td>{restaurante.direccion}</Td>
              <Td>
                <Button
                  colorScheme="teal"
                  variant="outline"
                  onClick={() => {
                    setAction(Action.UPDATE);
                    setId(restaurante.id.toString());
                    setName(restaurante.nombre);
                    setDireccion(restaurante.direccion);
                  }}
                >
                  Editar
                </Button>

                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={() => {
                    api
                      .delete(`/restaurantes/${restaurante.id}`)
                      .then((value) => {
                        const newRestaurantes = restaurantes.filter(
                          (rest) => rest.id !== restaurante.id
                        );
                        setRestaurantes(newRestaurantes);
                      })
                      .catch((error) => {
                        setError("Ocurrio un error al eliminar el restaurante");
                        setTimeout(() => {
                          setError("");
                        }, 5000);
                      });
                  }}
                >
                  Eliminar
                </Button>

                <Link href={`/reservas/${restaurante.id}`}>
                  <Button colorScheme="red" variant="outline">
                    Ver Reservas
                  </Button>
                </Link>
                <Link href={`/mesas/${restaurante.id}`}>
                  <Button colorScheme="red" variant="outline">
                    Ver Mesas
                  </Button>
                </Link>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  ) : (
    <Center>No hay restaurantes</Center>
  );

  return (
    <>
      <Center>
        <Heading as="h1" size="xl">
          Restaurantes
        </Heading>
      </Center>
      {body}
      <FloatingActionButton
        onClick={() => {
          setAction(Action.CREATE);
          resetForm();
        }}
      />
      {/* //Create a button that says Crear Reseva */}

      <Box position="fixed" top="0" right="0" m={4}>
        <Link href={`/crear-reserva`}>
          <Button colorScheme="blue" variant="outline">
            Crear Reservar
          </Button>
        </Link>
      </Box>

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
              {action === Action.CREATE
                ? "Crear Restaurante"
                : "Editar Restaurante"}
            </AlertDialogHeader>

            <AlertDialogBody>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl isRequired isInvalid={error.length !== 0}>
                    <FormLabel>Name</FormLabel>
                    <Input
                      type="text"
                      placeholder="Nombre del Restaurante"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <FormErrorMessage>{error}</FormErrorMessage>
                  </FormControl>

                  <FormControl isRequired isInvalid={error.length !== 0}>
                    <FormLabel>Direccion</FormLabel>
                    <Input
                      type="text"
                      placeholder="Ingrese direccion"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
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

      <MoreOptionsDialog
        isOpen={action === Action.MORE_OPTIONS ? true : false}
        onClose={() => {
          setAction(Action.NONE);
        }}
      />
    </>
  );
}

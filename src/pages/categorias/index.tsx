/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Text,
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { CategoriaProducto } from "@prisma/client";
import FloatingActionButton from "@/components/floating_action_button";
import SpinnerLoading from "@/components/spinner";
import { ApiService } from "@/data/api_service";
import { MoreOptionsDialog } from "@/components/more_options_dialog";
import Link from "next/link";
import CrearReserva from "@/components/crear-reserva";

enum Action {
  NONE = "NONE",
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  MORE_OPTIONS = "MORE_OPTIONS",
}

export default function Categorias() {
  const api = new ApiService();
  const [categorias, setCategorias] = React.useState<CategoriaProducto[]>([]);
  const [loadingCategorias, setLoadingCategorias] =
    React.useState<boolean>(true);

  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const [action, setAction] = React.useState<Action>(Action.NONE);

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (action === Action.CREATE) {
        if (!name) {
          setError("Todos los campos son requeridos");
          return;
        }

        const res = await api.post("/categorias", {
          nombre: name,
        });

        setCategorias([...categorias, res]);
      } else if (action === Action.UPDATE) {
        const res = await api.put(`/categorias/${id}`, {
          nombre: name,
        });

        const newCategorias = categorias.map((categoria) => {
          if (categoria.id === Number(id)) {
            return res;
          }
          return categoria;
        });

        setCategorias(newCategorias);
      }

      resetForm();
      setAction(Action.NONE);
    } catch (error) {
      console.log(error);
      setError("Ocurrio un error al crear el categoria");
    }
  };

  function resetForm() {
    setId("");
    setName("");
  }

  useEffect(() => {
    setLoadingCategorias(true);
    api
      .get(`/categorias`)
      .then((response) => {
        setLoadingCategorias(false);
        setCategorias(response);
      })
      .catch((error) => {
        setLoadingCategorias(false);
        setError("Ocurrio un error al obtener los categorias");
        setTimeout(() => {
          setError("");
        }, 5000);
      });
  }, []);

  if (loadingCategorias) {
    return <SpinnerLoading title="Cargando Categorias" />;
  }

  const body = categorias.length ? (
    <TableContainer>
      <Table variant="simple">
        <TableCaption>Categorias Disponibles</TableCaption>
        <Thead>
          <Tr>
            <Th>Nombre</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {categorias.map((categoria) => (
            <Tr key={categoria.id}>
              <Td>{categoria.nombre}</Td>
              <Td>
                <Button
                  colorScheme="teal"
                  variant="outline"
                  onClick={() => {
                    setAction(Action.UPDATE);
                    setId(categoria.id.toString());
                    setName(categoria.nombre);
                  }}
                >
                  Editar
                </Button>

                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={() => {
                    api
                      .delete(`/categorias/${categoria.id}`)
                      .then((value) => {
                        const newCategorias = categorias.filter(
                          (rest) => rest.id !== categoria.id
                        );
                        setCategorias(newCategorias);
                      })
                      .catch((error) => {
                        setError("Ocurrio un error al eliminar el categoria");
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
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  ) : (
    <Center>No hay categorias</Center>
  );

  return (
    <>
      <Center>
        <Heading as="h1" size="xl">
          Categorias
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
              {action === Action.CREATE
                ? "Crear Categoria"
                : "Editar Categoria"}
            </AlertDialogHeader>

            <AlertDialogBody>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl isRequired isInvalid={error.length !== 0}>
                    <FormLabel>Name</FormLabel>
                    <Input
                      type="text"
                      placeholder="Nombre del Categoria"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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

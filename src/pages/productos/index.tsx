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
  Select,
} from "@chakra-ui/react";
import { CategoriaProducto, Producto } from "@prisma/client";
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

export default function Productos() {
  const api = new ApiService();
  const [productos, setProductos] = React.useState<Producto[]>([]);
  const [loadingProductos, setLoadingProductos] = React.useState<boolean>(true);
  const [categorias, setCategorias] = React.useState<CategoriaProducto[]>([]);
  const [loadingCategorias, setLoadingCategorias] =
    React.useState<boolean>(true);

  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const [action, setAction] = React.useState<Action>(Action.NONE);

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoriaId, setCategoriaId] = useState<string>();
  const [error, setError] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleCategoria = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setCategoriaId(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (action === Action.CREATE) {
        if (!name || !precio) {
          setError("Todos los campos son requeridos");
          return;
        }

        const res = await api.post("/productos", {
          nombre: name,
          precio: precio,
          categoria: categoriaId,
        });



        setProductos([...productos, res]);
      } else if (action === Action.UPDATE) {
        const res = await api.put(`/productos/${id}`, {
          nombre: name,
          precio: precio,
          categoria: categoriaId,
        });

        const newProductos = productos.map((producto) => {
          if (producto.id === Number(id)) {
            return res;
          }
          return producto;
        });

        setProductos(newProductos);
      }

      resetForm();
      setAction(Action.NONE);
    } catch (error) {
      console.log(error);
      setError("Ocurrio un error al crear el producto");
    }
  };

  function resetForm() {
    setId("");
    setName("");
    setPrecio("");
    setCategoriaId("");
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
        setError("Ocurrio un error al obtener las categorias");
        setTimeout(() => {
          setError("");
        }, 5000);
      });
  }, []);

  useEffect(() => {
    setLoadingProductos(true);
    api
      .get(`/productos`)
      .then((response) => {
        setLoadingProductos(false);
        setProductos(response);
        console.log(response);
      })
      .catch((error) => {
        setLoadingProductos(false);
        setError("Ocurrio un error al obtener los productos");
        setTimeout(() => {
          setError("");
        }, 5000);
      });
  }, []);

  if (loadingProductos) {
    return <SpinnerLoading title="Cargando Productos" />;
  }

  const body = productos.length ? (
    <TableContainer>
      <Table variant="simple">
        <TableCaption>Productos Disponibles</TableCaption>
        <Thead>
          <Tr>
            <Th>Nombre</Th>
            <Th>Categoria</Th>
            <Th>Precio</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {productos.map((producto) => (
            <Tr key={producto.id}>
              <Td>{producto.nombre}</Td>
              <Td>{producto.categoria?.nombre}</Td>
              <Td>{producto.precio_venta}</Td>
              <Td>
                <Button
                  colorScheme="teal"
                  variant="outline"
                  onClick={() => {
                    setAction(Action.UPDATE);
                    setId(producto.id.toString());
                    setName(producto.nombre);
                    setPrecio(producto.precio_venta.toString());
                    setCategoriaId(producto.categoria?.id.toString());
                  }}
                >
                  Editar
                </Button>

                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={() => {
                    api
                      .delete(`/productos/${producto.id}`)
                      .then((value) => {
                        const newProductos = productos.filter(
                          (rest) => rest.id !== producto.id
                        );
                        setProductos(newProductos);
                      })
                      .catch((error) => {
                        setError("Ocurrio un error al eliminar el producto");
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
    <Center>No hay productos</Center>
  );

  return (
    <>
      <Center>
        <Heading as="h1" size="xl">
          Productos
        </Heading>
      </Center>
      {body}
      <FloatingActionButton
        onClick={() => {
          if (categorias.length === 0) {
            setError("No hay categorias disponibles. Por favor crea una.");
            setTimeout(() => {
              setError("");
            }, 5000);
            return;
          }
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
              {action === Action.CREATE ? "Crear Producto" : "Editar Producto"}
            </AlertDialogHeader>

            <AlertDialogBody>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl isRequired isInvalid={error.length !== 0}>
                    <FormLabel>Name</FormLabel>
                    <Input
                      type="text"
                      placeholder="Nombre del Producto"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <FormErrorMessage>{error}</FormErrorMessage>
                  </FormControl>

                  {/* Create a dropdown with categories */}
                  <FormControl id="categoria" isRequired>
                    <FormLabel>Categria</FormLabel>
                    <Select
                      value={categoriaId ?? "0"}
                      onChange={(e) => {
                        handleCategoria(e);
                      }}
                      placeholder="Eliga un categoria"
                      required
                    >
                      {categorias.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                          {categoria.nombre}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl isRequired isInvalid={error.length !== 0}>
                    <FormLabel>Precio</FormLabel>
                    <Input
                      type="text"
                      placeholder="Ingrese precio"
                      value={precio}
                      onChange={(e) => setPrecio(e.target.value)}
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

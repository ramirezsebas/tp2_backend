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
} from "@chakra-ui/react";
import { Restaurante } from "@prisma/client";
import FloatingActionButton from "@/components/floating_action_button";

export default function Restaurantes() {
  const [restaurantes, setRestaurantes] = React.useState<Restaurante[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const onClose = () => setIsOpen(false);

  const [name, setName] = useState("");
  const [direccion, setDireccion] = useState("");
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("submit");

    if (!name || !direccion) {
      setError("Todos los campos son requeridos");
      setIsError(true);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/restaurantes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: name,
          direccion: direccion,
        }),
      });

      const data = await res.json();

      if (data && data.error) {
        setError(data.message);
        setIsError(true);
        return;
      }

      setSuccess(true);
      setName("");
      setDireccion("");
      setIsError(false);
      setIsOpen(false);
      setSuccess(false);
    } catch (error) {
      console.log(error);
      setError("Ocurrio un error al crear el restaurante");
      setIsError(true);
    }
  };

  useEffect(() => {
    fetch("http://localhost:3000/api/restaurantes")
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Ocurrio un error al obtener los restaurantes");
        }
      })
      .then((data) => {
        setLoading(false);
        setRestaurantes(data);
      })
      .catch((error) => {
        setLoading(false);
        setError("Ocurrio un error al obtener los restaurantes");
        setTimeout(() => {
          setError("");
        }, 5000);
      });
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
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
                <Button colorScheme="teal" variant="outline">
                  Editar
                </Button>

                <Button colorScheme="red" variant="outline">
                  Eliminar
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  ) : (
    <div>No hay restaurantes</div>
  );

  return (
    <>
      <Heading as="h1" size="xl">
        Restaurantes
      </Heading>
      {body}
      <FloatingActionButton
        onClick={() => {
          setIsOpen(true);
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
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Agregar Restaurante
            </AlertDialogHeader>

            <AlertDialogBody>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl isRequired isInvalid={isError}>
                    <FormLabel>Name</FormLabel>
                    <Input
                      type="text"
                      placeholder="Nombre del Restaurante"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <FormErrorMessage>{error}</FormErrorMessage>
                  </FormControl>

                  <FormControl isRequired isInvalid={isError}>
                    <FormLabel>Direccion</FormLabel>
                    <Input
                      type="text"
                      placeholder="Ingrese direccion"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                    />
                    <FormErrorMessage>{error}</FormErrorMessage>
                  </FormControl>

                  {success && <p>Fue creado exitosamente</p>}
                </VStack>
              </form>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleSubmit} ml={3}>
                Agregar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

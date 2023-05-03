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
} from "@chakra-ui/react";
import { Cliente } from "@prisma/client";
import FloatingActionButton from "@/components/floating_action_button";
import SpinnerLoading from "@/components/spinner";
import { ApiService } from "@/data/api_service";

enum Action {
  NONE = "NONE",
  CREATE = "CREATE",
  UPDATE = "UPDATE",
}

export default function Clientes() {
  const api = new ApiService();
  const [clientes, setClientes] = React.useState<Cliente[]>([]);
  const [loadingClientes, setLoadingClientes] = React.useState<boolean>(false);

  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const [action, setAction] = React.useState<Action>(Action.NONE);

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [apellido, setApellido] = useState("");
  const [cedula, setCedula] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (action === Action.CREATE) {
        if (!name || !apellido || !cedula) {
          setError("Todos los campos son requeridos");
          return;
        }

        const res = await api.post("/clientes", {
          nombre: name,
          apellido: apellido,
          cedula: cedula,
        });

        setClientes([...clientes, res]);
      } else if (action === Action.UPDATE) {
        const res = await api.put(`/clientes/${id}`, {
          nombre: name,
          apellido: apellido,
          cedula: cedula,
        });

        const newClientes = clientes.map((cliente) => {
          if (cliente.id === Number(id)) {
            return res;
          }
          return cliente;
        });

        setClientes(newClientes);
      }

      resetForm();
      setAction(Action.NONE);
    } catch (error) {
      console.log(error);
      setError("Ocurrio un error al crear el cliente");
    }
  };

  function resetForm() {
    setId("");
    setName("");
    setApellido("");
    setCedula("");
  }

  useEffect(() => {
    setLoadingClientes(true);
    api
      .get(`/clientes`)
      .then((response) => {
        setLoadingClientes(false);
        setClientes(response);
      })
      .catch((error) => {
        setLoadingClientes(false);
        setError("Ocurrio un error al obtener los clientes");
        setTimeout(() => {
          setError("");
        }, 5000);
      });
  }, []);

  if (loadingClientes) {
    return <SpinnerLoading title="Cargando Clientes" />;
  }

  const body = clientes.length ? (
    <TableContainer>
      <Table variant="simple">
        <TableCaption>Clientes Disponibles</TableCaption>
        <Thead>
          <Tr>
            <Th>Nombre</Th>
            <Th>Apellido</Th>
            <Th>Cedula</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {clientes.map((cliente) => (
            <Tr key={cliente.id}>
              <Td>{cliente.nombre}</Td>
              <Td>{cliente.apellido}</Td>
              <Td>{cliente.cedula}</Td>
              <Td>
                <Button
                  colorScheme="teal"
                  variant="outline"
                  onClick={() => {
                    setAction(Action.UPDATE);
                    setId(cliente.id.toString());
                    setName(cliente.nombre);
                    setApellido(cliente.apellido);
                    setCedula(cliente.cedula);
                  }}
                >
                  Editar
                </Button>

                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={() => {
                    api
                      .delete(`/clientes/${cliente.id}`)
                      .then((value) => {
                        const newClientes = clientes.filter(
                          (rest) => rest.id !== cliente.id
                        );
                        setClientes(newClientes);
                      })
                      .catch((error) => {
                        setError("Ocurrio un error al eliminar el cliente");
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
    <Center>No hay clientes</Center>
  );

  return (
    <>
      <Center>
        <Heading as="h1" size="xl">
          Clientes
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
              {action === Action.CREATE ? "Crear Cliente" : "Editar Cliente"}
            </AlertDialogHeader>

            <AlertDialogBody>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl isRequired isInvalid={error.length !== 0}>
                    <FormLabel>Name</FormLabel>
                    <Input
                      type="text"
                      placeholder="Nombre del Cliente"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <FormErrorMessage>{error}</FormErrorMessage>
                  </FormControl>

                  <FormControl isRequired isInvalid={error.length !== 0}>
                    <FormLabel>Apellido</FormLabel>
                    <Input
                      type="text"
                      placeholder="Ingrese apellido"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                    />
                    <FormErrorMessage>{error}</FormErrorMessage>
                  </FormControl>
                  <FormControl isRequired isInvalid={error.length !== 0}>
                    <FormLabel>Cedula</FormLabel>
                    <Input
                      type="text"
                      placeholder="Ingrese cedula"
                      value={cedula}
                      onChange={(e) => setCedula(e.target.value)}
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

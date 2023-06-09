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
import { ConsumoMesa } from "@prisma/client";
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

export default function Consumos() {
    const api = new ApiService();
    const [consumos, setConsumos] = React.useState<ConsumoMesa[]>([]);
    const [loadingConsumos, setLoadingConsumos] = React.useState<boolean>(true);

    const cancelRef = React.useRef<HTMLButtonElement>(null);
    const [action, setAction] = React.useState<Action>(Action.NONE);

    const [id, setId] = useState("");
    const [estado, setEstado] = useState("");
    const [total, setTotal] = useState("");
    const [error, setError] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();


    const [clientes, setClientes] = useState([]);
    const [productos, setProductos] = useState([]);
    const [mesas, setMesas] = useState([]);
    const [restaurantes, setRestaurantes] = useState([]);

    const [clienteSeleccionado, setClienteSeleccionado] = useState("");
    const [productoSeleccionado, setProductoSeleccionado] = useState("");
    const [mesaSeleccionada, setMesaSeleccionada] = useState("");
    const [restauranteSeleccionado, setRestauranteSeleccionado] = useState("");

    const [cantidad, setCantidad] = useState("");
    const [totalFinal, setTotalFinal] = useState(0);

    useEffect
        (() => {
            api
                .get(`/clientes`)
                .then((response) => {
                    setClientes(response);
                    console.log(response);
                })
                .catch((error) => {
                    setError("Ocurrio un error al obtener los clientes");
                    setTimeout(() => {
                        setError("");
                    }, 5000);
                });
        }, []);

    useEffect
        (() => {
            api

                .get(`/productos`)
                .then((response) => {
                    setProductos(response);
                    console.log(response);
                })
                .catch((error) => {
                    setError("Ocurrio un error al obtener los productos");
                    setTimeout(() => {
                        setError("");
                    }, 5000);
                });
        }, []);

    useEffect
        (() => {
            api
                .get(`/restaurantes`)
                .then((response) => {
                    setRestaurantes(response);
                    console.log(response);
                })
                .catch((error) => {
                    setError("Ocurrio un error al obtener los restaurantes");
                    setTimeout(() => {
                        setError("");
                    }, 5000);
                });
        }, []);










    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            if (action === Action.CREATE) {
                if (!id || !estado || !total) {
                    setError("Todos los campos son requeridos");
                    return;
                }

                // const res = await api
                //     .post("/consumos", {
                //         id_mesa: id,
                //         id_cliente: clienteSeleccionado,
                //         id_restaurante: idRestaurante,
                //         total: productoSeleccionadoo.precio_venta * Number(cantidad),
                //         DetalleConsumo: {
                //             id_producto: productoSeleccionado,
                //             cantidad: cantidad,
                //             total: productoSeleccionadoo.precio_venta * Number(cantidad),
                //             precio: Number(
                //                 productos.filter(
                //                     (producto: Producto) =>
                //                         producto.id === productoSeleccionado
                //                 )[0].precio_venta
                //             ),
                //         },
                //     });




                // setConsumos([...consumos, res]);
            } else if (action === Action.UPDATE) {
                // const res = api.put(`/consumos/${consumo?.id}`, {
                //     id_mesa: id,
                //     id_cliente: clienteSeleccionado,
                //     id_restaurante: idRestaurante,
                //     total: totalFinal,
                //     DetalleConsumo: {
                //       id_producto: productoSeleccionado,
                //       cantidad: cantidad,
                //       total: Number(
                //         productoSeleccionadoo.precio_venta
                //       ) * Number(cantidad),
                //       precio: Number(
                //         productoSeleccionadoo.precio_venta
                //       ),
                //     },
                //   })
                //     .then(
                //       (response) => {
                //         console.log(response);
                //       }
                //     )
                //     .catch((error) => {
                //       console.log(error);
                //       setError("Ocurrio un error al crear el consumo");
                //       setTimeout(() => {
                //         setError("");
                //       }, 5000);
                //     }
                //     );

                // const newConsumos = consumos.map((consumo) => {
                //     if (consumo.id === Number(id)) {
                //         return res;
                //     }
                //     return consumo;
                // });

                // setConsumos(newConsumos);
            }

            resetForm();
            setAction(Action.NONE);
        } catch (error) {
            console.log(error);
            setError("Ocurrio un error al crear el consumo");
        }
    };

    function resetForm() {
        setId("");
        setEstado("");
        setTotal("");
    }



    useEffect(() => {
        setLoadingConsumos(true);
        api
            .get(`/consumos`)
            .then((response) => {
                setLoadingConsumos(false);
                setConsumos(response);
                console.log(response);
            })
            .catch((error) => {
                setLoadingConsumos(false);
                setError("Ocurrio un error al obtener los consumos");
                setTimeout(() => {
                    setError("");
                }, 5000);
            });
    }, []);

    if (loadingConsumos) {
        return <SpinnerLoading title="Cargando Consumos" />;
    }

    const body = consumos.length ? (
        <TableContainer>
            <Table variant="simple">
                <TableCaption>Consumos Disponibles</TableCaption>
                <Thead>
                    <Tr>
                        <Th>Restaurante</Th>
                        <Th>Nombre Cliente</Th>
                        <Th>Estado</Th>
                        <Th>Mesa</Th>
                        <Th>Fecha</Th>
                        <Th>Total</Th>
                        <Th>Acciones</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {consumos.map((consumo) => (
                        <Tr key={consumo?.id}>
                            <Td>{consumo?.restaurante?.nombre}</Td>
                            <Td>{consumo?.cliente?.nombre}</Td>
                            <Td>{consumo?.estado}</Td>
                            <Td>{consumo?.mesa?.nombre}</Td>
                            <Td>{consumo?.fechaCreacion.toString()}</Td>
                            <Td>{consumo?.total}</Td>
                            <Td>
                                <Button
                                    colorScheme="teal"
                                    variant="outline"
                                    onClick={() => {
                                        setAction(Action.UPDATE);
                                        setId(consumo.id.toString());
                                        setEstado(consumo.estado);
                                        setTotal(consumo.total.toString());
                                    }}
                                >
                                    Editar
                                </Button>

                                <Button
                                    colorScheme="red"
                                    variant="outline"
                                    onClick={() => {
                                        api
                                            .delete(`/consumos/${consumo.id}`)
                                            .then((value) => {
                                                const newConsumos = consumos.filter(
                                                    (rest) => rest.id !== consumo.id
                                                );
                                                setConsumos(newConsumos);
                                            })
                                            .catch((error) => {
                                                setError("Ocurrio un error al eliminar el consumo");
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
        <Center>No hay consumos</Center>
    );

    return (
        <>
            <Center>
                <Heading as="h1" size="xl">
                    Consumos
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
                            {action === Action.CREATE ? "Crear Consumo" : "Editar Consumo"}
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            <form onSubmit={handleSubmit}>
                                <VStack spacing={4}>
                                    <FormControl isRequired isInvalid={error.length !== 0}>
                                        <FormLabel>Estado</FormLabel>
                                        <Input
                                            type="text"
                                            placeholder="Nombre del Consumo"
                                            value={estado}
                                            onChange={(e) => setEstado(e.target.value)}
                                        />
                                        <FormErrorMessage>{error}</FormErrorMessage>
                                    </FormControl>

                                    {/* Create a dropdown with categories
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
                                    </FormControl> */}

                                    <FormControl isRequired isInvalid={error.length !== 0}>
                                        <FormLabel>Precio</FormLabel>
                                        <Input
                                            type="text"
                                            placeholder="Ingrese precio"
                                            value={total}
                                            onChange={(e) => setTotal(e.target.value)}
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

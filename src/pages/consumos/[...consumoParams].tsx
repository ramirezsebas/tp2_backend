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
import { Cliente, ConsumoMesa, DetalleConsumo, Producto } from "@prisma/client";
import FloatingActionButton from "@/components/floating_action_button";
import SpinnerLoading from "@/components/spinner";
import { ApiService } from "@/data/api_service";
import { MoreOptionsDialog } from "@/components/more_options_dialog";
import Link from "next/link";
import CrearReserva from "@/components/crear-reserva";
import { useRouter } from "next/router";
import CrearCliente from "@/components/crear_cliente";


enum Action {
    NONE = "NONE",
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    MORE_OPTIONS = "MORE_OPTIONS",
}

export default function Consumos2() {
    const api = new ApiService();
    const [consumos, setConsumos] = React.useState<ConsumoMesa[]>([]);
    const [loadingConsumos, setLoadingConsumos] = React.useState<boolean>(true);

    const cancelRef = React.useRef<HTMLButtonElement>(null);
    const [action, setAction] = React.useState<Action>(Action.NONE);
    const router = useRouter();

    const [cedula, setCedula] = useState("");

    const [id, setId] = useState("");
    const [estado, setEstado] = useState("");
    const [total, setTotal] = useState(0);
    const [error, setError] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [clientes, setClientes] = useState([]);
    const [productos, setProductos] = useState([]);

    const [clienteSeleccionado, setClienteSeleccionado] = useState("");
    const [productoSeleccionado, setProductoSeleccionado] = useState("");
    const [consumo, setConsumo] = useState<ConsumoMesa | null>(null);

    const [cantidad, setCantidad] = useState(1);
    const [showCrearCliente, setShowCrearCliente] = useState<boolean>(false);
    const [clienteData, setClienteData] = useState({
        nombre: "",
        apellido: "",
        cedula: 0,

    });
    const [isOpenForCreateDetail, setIsOpenForCreateDetail] = useState(false);

    const params = router.query.consumoParams as String[];

    useEffect

        (() => {


            if (params) {
                const idRestaurante = params[0] as String;
                const idMesa = params[1] as String;


                setLoadingConsumos(true);
                api
                    .get(`/consumos`)
                    .then((response) => {
                        setLoadingConsumos(false);
                        const filteredConsumos = response.filter(
                            (consumo: ConsumoMesa) =>

                                consumo.id_mesa === Number(idMesa) &&
                                consumo.id_restaurante === Number(idRestaurante)
                        );
                        setConsumos(filteredConsumos);
                        console.log(response);
                    })
                    .catch((error) => {
                        console.log(error);
                        setLoadingConsumos(false);
                        setError("Ocurrio un error al obtener los consumos");
                        setTimeout(() => {
                            setError("");
                        }, 5000);
                    });
            }

        }, [params]);

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
                console.log("update");
                console.log(consumo);
                const res = api.put(`/consumos/${consumo?.id}`, {
                    id_cliente: clienteSeleccionado,
                })
                    .then(
                        (response) => {
                            console.log(response);
                            const newConsumos = response.map((consumo: any) => {
                                if (consumo.id === Number(id)) {
                                    return res;
                                }
                                return consumo;
                            });

                            setConsumos(newConsumos);
                        }
                    )
                    .catch((error) => {
                        console.log(error);
                        setError("Ocurrio un error al crear el consumo");
                        setTimeout(() => {
                            setError("");
                        }, 5000);
                    }
                    );


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
        setTotal(0);
        setClienteSeleccionado("");
        setProductoSeleccionado("");
        setCantidad(0);
    }



    useEffect(() => {

    }, []);

    if (loadingConsumos) {
        return <SpinnerLoading title="Cargando Consumos" />;
    }

    const body = consumos.length ? (
        <>
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
                        {
                            consumos.map((consumo) => (
                                <>
                                    <Tr key={consumo?.id}>
                                        <Td>{consumo?.restaurante?.nombre}</Td>
                                        <Td>{consumo?.cliente?.nombre}</Td>
                                        <Td>{consumo?.estado}</Td>
                                        <Td>{consumo?.mesa?.nombre}</Td>
                                        <Td>{consumo?.fechaCreacion.toString()}</Td>
                                        <Td>{consumo?.total}</Td>
                                        <Td>
                                            {

                                                consumo.estado.toLowerCase() === "abierto" && <Button
                                                    colorScheme="teal"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setAction(Action.UPDATE);
                                                        setId(consumo.id.toString());
                                                        setEstado(consumo.estado);
                                                        setTotal(consumo.total);
                                                        setClienteSeleccionado(consumo?.id_cliente.toString());
                                                        // setClienteSeleccionado(consumo?.cliente.id.toString());
                                                        setProductoSeleccionado(consumo?.id.toString());
                                                        setConsumo(consumo);

                                                    }}
                                                >
                                                    Actualizar Cliente
                                                </Button>
                                            }

                                            {consumo.estado.toLowerCase() === "abierto" && <Button
                                                colorScheme="red"
                                                variant="outline"
                                                onClick={() => {
                                                    const res = api.put(`/consumos/${consumo?.id}`, {
                                                        estado: 'cerrado',
                                                    })
                                                        .then(
                                                            (response) => {
                                                                console.log(response);
                                                                const newConsumos = response.map((consumo: any) => {
                                                                    if (consumo.id === Number(id)) {
                                                                        return res;
                                                                    }
                                                                    return consumo;
                                                                });

                                                                setConsumos(newConsumos);
                                                            }
                                                        )
                                                        .catch((error) => {
                                                            console.log(error);
                                                            setError("Ocurrio un error al crear el consumo");
                                                            setTimeout(() => {
                                                                setError("");
                                                            }, 5000);
                                                        }
                                                        );


                                                }}
                                            >
                                                Cerrar
                                            </Button>
                                            }
                                        </Td>
                                    </Tr>
                                    {
                                        consumo.estado.toLowerCase() === "abierto" && <>
                                            <Text fontSize="xl" fontWeight="bold">
                                                Detalle Consumo
                                            </Text>
                                            <Button
                                                colorScheme="teal"
                                                variant="outline"
                                                onClick={() => {
                                                    // setAction(Action.UPDATE);
                                                    // setId(detalle.id.toString());
                                                    // setEstado(detalle.cantidad.toString());
                                                    // setTotal(detalle.total.toString());
                                                    setIsOpenForCreateDetail(true);
                                                    setConsumo(consumo);
                                                    setClienteSeleccionado(consumo?.id_cliente.toString());
                                                }}
                                            >
                                                Agregar Detalle
                                            </Button>
                                            <Table variant="simple">
                                                <TableCaption>Detalle Consumo</TableCaption>
                                                <Thead>
                                                    <Tr>
                                                        <Th>Producto</Th>
                                                        <Th>Cantidad</Th>
                                                        <Th>Precio</Th>
                                                        <Th>Total</Th>

                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {consumo?.DetalleConsumo.map((detalle: DetalleConsumo) => (
                                                        <Tr key={detalle?.id}>
                                                            <Td>{detalle?.producto?.nombre}</Td>
                                                            <Td>{detalle?.cantidad}</Td>
                                                            <Td>{detalle?.precio}</Td>
                                                            <Td>{detalle?.total}</Td>

                                                        </Tr>
                                                    ))}
                                                </Tbody>
                                            </Table>
                                        </>
                                    }


                                </>
                            ))}
                    </Tbody>
                </Table >
            </TableContainer>
        </>
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
                                    <Select
                                        placeholder="Seleccione un cliente"
                                        value={clienteSeleccionado?.toString()}
                                        onChange={(e) => {
                                            console.log(e.target.value);
                                            if (Number(e.target.value) === 0) {
                                                setShowCrearCliente(true);
                                            }
                                            setClienteSeleccionado(e.target.value);
                                        }}
                                    >
                                        {clientes?.map((cliente: Cliente) => (
                                            <option key={cliente.id} value={cliente.id}>
                                                {cliente.nombre}
                                            </option>
                                        ))}
                                        <option value={cedula ? cedula : "0"}>
                                            Nuevo Cliente
                                        </option>
                                    </Select>
                                    {showCrearCliente && (
                                        <CrearCliente
                                            clienteData={clienteData}
                                            setClienteData={setClienteData}
                                            setCedula={setCedula}
                                        />
                                    )}

                                    {/* <FormControl isRequired isInvalid={error.length !== 0}>
                                        <FormLabel>Precio</FormLabel>
                                        <Input
                                            type="text"
                                            placeholder="Ingrese precio"
                                            value={total}
                                            onChange={(e) => setTotal(e.target.value)}
                                        />
                                        <FormErrorMessage>{error}</FormErrorMessage>
                                    </FormControl> */}
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
            <AlertDialog
                isOpen={
                    isOpenForCreateDetail
                }
                leastDestructiveRef={cancelRef}
                onClose={() => {
                    setIsOpenForCreateDetail(false);
                }}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Agregar Detalle
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            <form onSubmit={handleSubmit}>
                                <VStack spacing={4}>
                                    <Select
                                        placeholder="Seleccione un producto"
                                        value={productoSeleccionado?.toString()}
                                        onChange={(e) => {
                                            console.log(e.target.value);
                                            setProductoSeleccionado(e.target.value);
                                            const newLocal = productos?.find((producto: Producto) => producto.id === Number(e.target.value))?.precio_venta.toString();
                                            setTotal(newLocal);

                                        }}
                                    >
                                        {productos?.map((producto: Producto) => (
                                            <option key={producto?.id} value={producto.id}>
                                                {producto?.nombre}
                                            </option>
                                        ))}
                                    </Select>


                                    <FormControl isRequired isInvalid={error.length !== 0}>
                                        <FormLabel>Precio</FormLabel>
                                        <Input
                                            type="text"
                                            readOnly
                                            placeholder="Ingrese precio"
                                            value={total}
                                        />
                                        <FormErrorMessage>{error}</FormErrorMessage>
                                    </FormControl>

                                    <FormControl isRequired isInvalid={error.length !== 0}>
                                        <FormLabel>Cantidad</FormLabel>
                                        <Input
                                            type="number"
                                            placeholder="Ingrese cantidad"
                                            value={cantidad}
                                            onChange={(e) => {
                                                const newLocal = productos.filter((producto: Producto) => producto.id === Number(e.target.value));

                                                const a = newLocal?.precio_venta;
                                                console.log("Jau");
                                                console.log(a);
                                                console.log(e.target.value);
                                                console.log(newLocal);
                                                setCantidad(Number(e.target.value));
                                            }}
                                        />
                                        <FormErrorMessage>{error}</FormErrorMessage>
                                    </FormControl>

                                </VStack>
                            </form>
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={() => setIsOpenForCreateDetail(false)}>
                                Cancelar
                            </Button>
                            <Button colorScheme="red" onClick={() => {
                                const res = api.put(`/consumos/${consumo?.id}`, {
                                    id_mesa: params[1],
                                    id_restaurante: params[0],
                                    id_cliente: clienteSeleccionado,
                                    DetalleConsumo: {
                                        id_producto: productoSeleccionado,
                                        cantidad: cantidad,
                                        total: total * cantidad,
                                        precio: total,
                                    },
                                })
                                    .then(
                                        (response) => {
                                            console.log(response);
                                            const newConsumos = response.map((consumo: any) => {
                                                if (consumo.id === Number(id)) {
                                                    return res;
                                                }
                                                return consumo;
                                            });

                                            setConsumos(newConsumos);
                                        }
                                    )
                                    .catch((error) => {
                                        console.log(error);
                                        setError("Ocurrio un error al crear el consumo");
                                        setTimeout(() => {
                                            setError("");
                                        }, 5000);
                                    }
                                    );

                                setIsOpenForCreateDetail(false);

                            }} ml={3}>
                                Crear
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
            <Button>

            </Button>
        </>
    );
}

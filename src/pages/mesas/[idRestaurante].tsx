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
  Text,
  Select,
} from "@chakra-ui/react";
import {
  Cliente,
  ConsumoMesa,
  DetalleConsumo,
  Mesa,
  Producto,
} from "@prisma/client";
import FloatingActionButton from "@/components/floating_action_button";
import SpinnerLoading from "@/components/spinner";
import { ApiService } from "@/data/api_service";
import { MoreOptionsDialog } from "@/components/more_options_dialog";
import { useRouter } from "next/router";
import { set } from "date-fns";
import CrearCliente from "@/components/crear_cliente";

enum Action {
  NONE = "NONE",
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  MORE_OPTIONS = "MORE_OPTIONS",
}

export default function Mesas() {
  const api = new ApiService();
  const router = useRouter();
  const { idRestaurante } = router.query;
  console.log(idRestaurante);
  const [mesas, setMesas] = React.useState<Mesa[]>([]);
  const [loadingMesas, setLoadingMesas] = React.useState<boolean>(true);

  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const [action, setAction] = React.useState<Action>(Action.NONE);
  const [isCreating, setIsCreating] = React.useState<boolean>(false);

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [direccion, setDireccion] = useState("");
  const [planta, setPlanta] = useState("");
  const [capacidad, setCapacidad] = useState("");
  const [posicionX, setPosicionX] = useState("");
  const [posicionY, setPosicionY] = useState("");
  const [error, setError] = useState("");
  const [mesasLibres, setMesasLibres] = useState<Mesa[]>([]);
  const [openConsumos, setOpenConsumos] = useState(false);
  const [consumo, setConsumo] = useState<ConsumoMesa>();
  const [clientes, setClientes] = useState<Cliente[]>();
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Number>();
  const [cedula, setCedula] = useState<string>("");
  const [showCrearCliente, setShowCrearCliente] = useState<boolean>(false);
  const [totalFinal, setTotalFinal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [clienteData, setClienteData] = useState({
    nombre: "",
    apellido: "",
    cedula: 0,
    // Add other fields as necessary
  });
  const [productos, setProductos] = React.useState<Producto[]>([]);
  const [cantidad, setCantidad] = useState<Number>();
  const [productoSeleccionado, setProductoSeleccionado] = useState<Number>();
  const [detallesConsumo, setDetallesConsumo] = useState<DetalleConsumo[]>();

  useEffect(() => {
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

  const handleSubmitConsumos = async (e: any) => {
    e.preventDefault();

    const productoSeleccionadoo = productos.filter(
      (producto: Producto) =>
        producto.id === productoSeleccionado
    )[0];

    try {
      if (!clienteSeleccionado) {
        setError("Debe seleccionar un cliente");
        setTimeout(() => {
          setError("");
        }, 5000);
        return;
      }



      if (isCreating) {
        if (!productoSeleccionado) {
          setError("Debe seleccionar un producto");
          setTimeout(() => {
            setError("");
          }, 5000);
          return;
        }

        if (!cantidad) {
          setError("Debe ingresar una cantidad");
          setTimeout(() => {
            setError("");
          }, 5000);
          return;
        }



        setOpenConsumos(false);
        api
          .post("/consumos", {
            id_mesa: id,
            id_cliente: clienteSeleccionado,
            id_restaurante: idRestaurante,
            total: productoSeleccionadoo.precio_venta * Number(cantidad),
            DetalleConsumo: {
              id_producto: productoSeleccionado,
              cantidad: cantidad,
              total: productoSeleccionadoo.precio_venta * Number(cantidad),
              precio: Number(
                productos.filter(
                  (producto: Producto) =>
                    producto.id === productoSeleccionado
                )[0].precio_venta
              ),
            },
          })
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
            setError("Ocurrio un error al crear el consumo");
            setTimeout(() => {
              setError("");
            }, 5000);
          });
        return;
      }



      console.log(productoSeleccionadoo);
      console.log("Consumo:");
      console.log(consumo);

      const res = api.put(`/consumos/${consumo?.id}`, {
        id_mesa: id,
        id_cliente: clienteSeleccionado,
        id_restaurante: idRestaurante,
        estado: "abierto",
        total: totalFinal,
        DetalleConsumo: {
          id_producto: productoSeleccionado,
          cantidad: cantidad,
          total: Number(
            productoSeleccionadoo.precio_venta
          ) * Number(cantidad),
          precio: Number(
            productoSeleccionadoo.precio_venta
          ),
        },
      })
        .then(
          (response) => {
            console.log(response);
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
      setOpenConsumos(false);

      resetForm();
    } catch (error) {
      console.log(error);
      setError("Ocurrio un error al actualizar consumo");
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (action === Action.CREATE) {
        if (!name || !direccion) {
          setError("Todos los campos son requeridos");
          return;
        }

        const res = await api.post(`/restaurantes/${idRestaurante}/mesas`, {
          nombre: name,
          direccion: direccion,
          capacidad: capacidad.toString(),
          planta: planta.toString(),
          posicion_x: posicionX.toString(),
          posicion_y: posicionY.toString(),
        });

        setMesas([...mesas, res]);
      } else if (action === Action.UPDATE) {
        if (Number(posicionX) < 0 || Number(posicionY) < 0) {
          setError("Las posiciones no pueden ser negativas");
          setTimeout(() => {
            setError("");
          }, 5000);
          return;
        }

        const res = await api.put(
          `/restaurantes/${idRestaurante}/mesas/${id}`,
          {
            nombre: name,
            direccion: direccion,
            capacidad: capacidad.toString(),
            planta: planta.toString(),
            posicion_x: posicionX.toString(),
            posicion_y: posicionY.toString(),
          }
        );

        const newMesas = mesas.map((mesa) => {
          if (mesa.id === Number(id)) {
            return res;
          }
          return mesa;
        });

        setMesas(newMesas);
      }

      resetForm();
      setAction(Action.NONE);
    } catch (error) {
      console.log(error);
      setError("Ocurrio un error al crear el mesa");
    }
  };

  function resetForm() {
    setId("");
    setName("");
    setDireccion("");
  }

  useEffect(() => {
    setLoadingMesas(true);
    console.log("idRestaurante");
    console.log(idRestaurante);
    if (!idRestaurante) {
      return;
    }
    api
      .get(`/restaurantes/${idRestaurante}/mesas`)
      .then((response) => {
        setLoadingMesas(false);
        setMesas(response);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
        setLoadingMesas(false);
        setError("Ocurrio un error al obtener los mesas");
        setTimeout(() => {
          setError("");
        }, 5000);
      });
  }, [idRestaurante]);

  useEffect(() => {
    api
      .get(`/clientes`)
      .then((response) => {
        setClientes(response);
      })
      .catch((error) => {
        setError("Ocurrio un error al obtener los clientes");
        setTimeout(() => {
          setError("");
        }, 5000);
      });
  }, []);

  if (loadingMesas) {
    return <SpinnerLoading title="Cargando Mesas" />;
  }

  const body = mesas.length ? (
    <TableContainer>
      <Table variant="simple">
        <TableCaption>Mesas Disponibles</TableCaption>
        <Thead>
          <Tr>
            <Th>Nombre</Th>
            <Th>Direccion</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {mesas.map((mesa) => (
            <Tr key={mesa.id}>
              <Td>{mesa.nombre}</Td>
              <Td>{mesa.direccion}</Td>
              <Td>
                <Button
                  colorScheme="teal"
                  variant="outline"
                  onClick={() => {
                    setAction(Action.UPDATE);
                    setId(mesa.id.toString());
                    setName(mesa.nombre);
                    setDireccion(mesa.direccion);
                  }}
                >
                  Editar
                </Button>

                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={() => {
                    api
                      .delete(`/restaurantes/${idRestaurante}/mesas/${mesa.id}`)
                      .then((value) => {
                        const newMesas = mesas.filter(
                          (rest) => rest.id !== mesa.id
                        );
                        setMesas(newMesas);
                      })
                      .catch((error) => {
                        setError("Ocurrio un error al eliminar el mesa");
                        setTimeout(() => {
                          setError("");
                        }, 5000);
                      });
                  }}
                >
                  Eliminar
                </Button>
                <Link href={`/consumos/${idRestaurante}/${mesa.id}`}>
                  <Button
                    colorScheme="red"
                    variant="outline"
                    onClick={() => {
                      // api
                      //   .get(`/consumos`)
                      //   .then((value: ConsumoMesa[]) => {
                      //     console.log(value);
                      //     console.log(mesa.id);
                      //     console.log(idRestaurante);
                      //     setId(mesa.id.toString());
                      //     let consumoFiltradosSinCliente: ConsumoMesa[] = value.filter(
                      //       (consumoMesa) =>
                      //         consumoMesa.id_mesa === mesa.id &&
                      //         consumoMesa.estado.toLocaleLowerCase() === "abierto" &&
                      //         Number(consumoMesa.id_restaurante) ===
                      //         Number(idRestaurante)
                      //     );
                      //     console.log("val");
                      //     console.log(consumoFiltradosSinCliente);

                      //     // setMesasLibres(value);


                      //     if (consumoFiltradosSinCliente.length !== 0) {
                      //       let consumoFiltradoConCliente = consumoFiltradosSinCliente.filter(
                      //         (rest: {
                      //           id_mesa: number;
                      //           estado: string;

                      //           id_cliente: number;
                      //         }) =>

                      //           rest.id_mesa === mesa.id &&
                      //           rest.estado.toLowerCase() === "abierto" &&
                      //           rest.id_cliente === Number(clienteSeleccionado)
                      //       );


                      //       console.log(consumoFiltradoConCliente[0]);
                      //       setConsumo(consumoFiltradoConCliente[0]);
                      //       setDetallesConsumo(consumoFiltradoConCliente[0]?.DetalleConsumo);
                      //       setClienteSeleccionado(Number(consumoFiltradoConCliente[0]?.id_cliente));

                      //       setOpenConsumos(true);





                      //       setTotalFinal(
                      //         consumoFiltradoConCliente[0]?.DetalleConsumo
                      //           .reduce((contador: any, consumo: any) => contador + consumo.total, 0)
                      //       );

                      //       setIsCreating(false);
                      //     } else {
                      //       setOpenConsumos(true);
                      //       setIsCreating(true);
                      //     }
                      //   })
                      //   .catch((error) => {
                      //     setError("Ocurrio un error al obtener la mesa");
                      //     setTimeout(() => {
                      //       setError("");
                      //     }, 5000);
                      //   });
                    }}
                  >
                    Ver Consumos
                  </Button>
                </Link>

              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  ) : (
    <Center>No hay mesas</Center>
  );

  return (
    <>
      <Center>
        <Heading as="h1" size="xl">
          Mesas
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
        isOpen={openConsumos}
        leastDestructiveRef={cancelRef}
        onClose={() => {
          setOpenConsumos(false);
        }}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Consumos
            </AlertDialogHeader>

            <AlertDialogBody>
              <form onSubmit={handleSubmitConsumos}>
                <VStack spacing={4}>
                  <FormControl isRequired isInvalid={error.length !== 0}>
                    <FormLabel>Consumos</FormLabel>
                    {/* <Input
                      type="text"
                      placeholder="Consumos"
                      value={Consumos}
                      onChange={(e) => setConsumos(e.target.value)}
                    />
                    <FormErrorMessage>{error}</FormErrorMessage> */}
                    <Select
                      placeholder="Seleccione un cliente"
                      value={clienteSeleccionado?.toString()}
                      onChange={(e) => {
                        console.log(e.target.value);
                        if (Number(e.target.value) === 0) {
                          setShowCrearCliente(true);
                        }
                        setClienteSeleccionado(Number(e.target.value));
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
                    <Text
                      color="blue.500"
                      size={"sm"}
                    >Detalles</Text>
                    {detallesConsumo?.map((detalle: DetalleConsumo) => (
                      <Text key={detalle.id}>
                        {productos.filter(
                          (producto: Producto) =>
                            producto.id === detalle.id_producto
                        ).map((producto: Producto) => (
                          producto.nombre
                        )
                        )
                        } - Cantidad: {detalle.cantidad} - Precio: {detalle.precio}{" "}
                        - Total: {detalle.total}
                      </Text>
                    ))}
                    <Text>Agregar Detalle</Text>
                    <Select
                      placeholder="Seleccione un producto"
                      value={productoSeleccionado?.toString()}
                      onChange={(e) => {
                        console.log(e.target.value);
                        setProductoSeleccionado(Number(e.target.value));
                      }}
                    >
                      {productos?.map((producto: Producto) => (
                        <option key={producto.id} value={producto.id}>
                          {producto.nombre}
                        </option>
                      ))}
                    </Select>
                    <Input
                      type="number"
                      placeholder="Cantidad"
                      value={cantidad?.toString()}
                      onChange={(e) => {
                        setTotal(
                          Number(e.target.value) *
                          Number(
                            productos.filter(
                              (producto: Producto) =>
                                producto.id === productoSeleccionado
                            )[0].precio_venta
                          )
                        );
                        setCantidad(Number(e.target.value));
                      }}
                    />
                    <Text>Total: {totalFinal}</Text>
                  </FormControl>
                </VStack>
              </form>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setOpenConsumos(false)}>
                Cancelar
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSubmitConsumos}
                ml={3}
              >
                Guardar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

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
              {action === Action.CREATE ? "Crear Mesa" : "Editar Mesa"}
            </AlertDialogHeader>

            <AlertDialogBody>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl isRequired isInvalid={error.length !== 0}>
                    <FormLabel>Name</FormLabel>
                    <Input
                      type="text"
                      placeholder="Nombre del Mesa"
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

                  <FormControl isRequired isInvalid={error.length !== 0}>
                    <FormLabel>Planta</FormLabel>
                    <Input
                      type="number"
                      placeholder="Ingrese Planta"
                      value={planta}
                      onChange={(e) => setPlanta(e.target.value)}
                    />
                    <FormErrorMessage>{error}</FormErrorMessage>
                  </FormControl>

                  <FormControl isRequired isInvalid={error.length !== 0}>
                    <FormLabel>Capacidad</FormLabel>
                    <Input
                      type="number"
                      placeholder="Ingrese Capacidad"
                      value={capacidad}
                      onChange={(e) => setCapacidad(e.target.value)}
                    />
                    <FormErrorMessage>{error}</FormErrorMessage>
                  </FormControl>

                  <FormControl isRequired isInvalid={error.length !== 0}>
                    <FormLabel>Posicion en X</FormLabel>
                    <Input
                      type="number"
                      placeholder="Ingrese Posicion en X"
                      value={posicionX}
                      onChange={(e) => setPosicionX(e.target.value)}
                    />
                    <FormErrorMessage>{error}</FormErrorMessage>
                  </FormControl>

                  <FormControl isRequired isInvalid={error.length !== 0}>
                    <FormLabel>Posicion en Y</FormLabel>
                    <Input
                      type="number"
                      placeholder="Ingrese Posicion en Y"
                      value={posicionY}
                      onChange={(e) => setPosicionY(e.target.value)}
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(100, 1fr)",
          gridTemplateRows: "repeat(100, 1fr)",
        }}
      >
        {mesas.map((mesa) => (
          <div
            key={mesa.id}
            style={{
              gridColumnStart: mesa.posicion_x,
              gridColumnEnd: mesa.posicion_x + 1,
              gridRowStart: mesa.posicion_y,
              gridRowEnd: mesa.posicion_y + 1,
              backgroundColor: "blue",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "1px solid white",
            }}
          >
            {mesa.nombre}
          </div>
        ))}
      </div>
    </>
  );
}

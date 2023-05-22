// Simple reservation creation page with a form and a map with no api calls
"use client";
import React, { useState, useEffect } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  List,
  ListItem,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  TimeRange,
  DisabledInterval,
  UpdateCallbackData,
} from "@matiaslgonzalez/react-timeline-range-slider";
import { set, startOfToday, startOfDay, endOfDay } from "date-fns";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import randomColor from "randomcolor";
import { ApiService } from "@/data/api_service";
import { Cliente, Reserva, Restaurante } from "@prisma/client";
import { Router, useRouter } from "next/router";
import CrearCliente from "@/components/crear_cliente";

const api = new ApiService();

interface Intervalo {
  id: string;
  start: Date;
  end: Date;
}

// interface Mesa {
//   id: number;
//   numSeats: number;
// }

// interface Reserva {
//   id: number;
//   fecha: Date;
//   intervalo: Intervalo;
//   mesasReservadas: number[];
// }

// interface Restaurante {
//   id: number;
//   name: string;
//   address: string;
//   phone: string;
//   email: string;
//   reservas: Reserva[];
//   mesas: Mesa[];
// }

interface CircleIconProps {
  color: string;
}

const CircleIcon: React.FC<CircleIconProps> = ({ color }) => {
  return (
    <Box
      width="16px"
      height="16px"
      borderRadius="50%"
      backgroundColor={color}
      marginRight="4px"
    />
  );
};

const cedulas = [
  "123456789",
  "987654321",
  "123456789",
  "987654321",
  "123456789",
  "987654321",
];

const CrearReserva2 = () => {
  const [name, setName] = useState<string>("");
  const [restaurants, setRestaurants] = useState<Restaurante[]>([]);
  const [loadingRestaurantes, setLoadingRestaurantes] = useState<boolean>(true);

  const [error, setError] = useState<string>("");
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurante>();
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [mesa, setMesa] = useState<string>("");
  const [capacidad, setCapacidad] = useState<string>("");
  const [cedula, setCedula] = useState<string>("");
  const router = useRouter();
  const [clientes, setClientes] = React.useState<Cliente[]>([]);
  const [loadingClientes, setLoadingClientes] = React.useState<boolean>(false);

  useEffect(() => {
    api
      .get(`/restaurantes`)
      .then((response) => {
        console.log("response");
        console.log(response);
        setLoadingRestaurantes(false);
        setRestaurants(response);
      })
      .catch((error) => {
        setLoadingRestaurantes(false);
        setError(
          error?.message ?? "Ocurrio un error al obtener los restaurantes"
        );
        setTimeout(() => {
          setError("");
        }, 5000);
      });
  }, []);

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
        setError(error?.message ?? "Ocurrio un error al obtener los clientes");
        setTimeout(() => {
          setError("");
        }, 5000);
      });
  }, []);

  const handleCiChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setCedula(e.target.value);
  };

  const handleMesaChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setMesa(event.target.value);
  };

  //TimeRangeVars
  const now = new Date();
  const getTodayAtSpecificHour = (hour = 12) =>
    set(now, { hours: hour, minutes: 0, seconds: 0, milliseconds: 0 });

  const selectedStart = getTodayAtSpecificHour();
  const selectedEnd = getTodayAtSpecificHour(14);

  const [startTime, setStartTime] = useState<Date>(startOfDay(selectedDate));
  const [endTime, setEndTime] = useState<Date>(endOfDay(selectedDate));
  const [selectedInterval, setSelectedInterval] = useState<[Date, Date]>([
    selectedStart,
    selectedEnd,
  ]);
  const [showCrearCliente, setShowCrearCliente] = useState<boolean>(false);
  const [clienteData, setClienteData] = useState({
    nombre: "",
    apellido: "",
    cedula: 0,
    // Add other fields as necessary
  });

  useEffect(() => {
    setStartTime(startOfDay(selectedDate));
    setEndTime(endOfDay(selectedDate));

    // Check if the dates are different before updating
    if (
      selectedInterval[0].getDate() !== selectedDate.getDate() ||
      selectedInterval[0].getMonth() !== selectedDate.getMonth() ||
      selectedInterval[0].getFullYear() !== selectedDate.getFullYear()
    ) {
      // Update the selectedStart and selectedEnd dates
      const newStart = set(selectedInterval[0], {
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth(),
        date: selectedDate.getDate(),
      });

      const newEnd = set(selectedInterval[1], {
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth(),
        date: selectedDate.getDate(),
      });

      setSelectedInterval([newStart, newEnd]);
    }
  }, [selectedDate, selectedInterval]);

  const [disabledIntervals, setDisabledIntervals] = useState<
    DisabledInterval[]
  >([]);

  useEffect(() => {
    console.log("mesa");
    console.log(mesa);
    console.log("selectedRestaurant");
    console.log(selectedRestaurant);
    console.log("selectedDate");
    console.log(selectedDate);
    if (selectedRestaurant && selectedDate && mesa) {
      api
        .get(`/restaurantes/${selectedRestaurant.id}/reservas`)
        .then((reservas: Reserva[]) => {
          console.log("reservas");
          console.log(reservas);
          // Filter the reservations based on the selected date and table
          const filteredReservas: Reserva[] = reservas.filter(
            (reserva) =>
              new Date(reserva.fecha).toISOString().slice(0, 10) ===
                new Date(selectedDate).toISOString().slice(0, 10) &&
              reserva.mesa.id.toString() === mesa
          );
          console.log("Se actualiza en el filteredReservas");
          console.log(filteredReservas);
          updateDisabledIntervals(selectedDate, filteredReservas);
        })
        .catch((error) => {
          setError(
            error?.message ??
              "Ocurrio un error al obtener las reservas del restaurante"
          );
          setTimeout(() => {
            setError("");
          }, 5000);
        });
    }
  }, [selectedRestaurant, selectedDate, mesa]);

  const [errorState, setErrorState] = useState<boolean>(false);

  const errorHandler = ({ error }: UpdateCallbackData) => {
    setErrorState(error);
  };

  const handleChange = (selectedInterval: [Date, Date]) => {
    setSelectedInterval(selectedInterval);
  };

  const updateDisabledIntervals = (
    selectedDate: Date,
    restaurantReservations: Reserva[]
  ) => {
    setDisabledIntervals([]);
    restaurantReservations.forEach((reserva) => {
      if (
        new Date(reserva.fecha).toISOString().slice(0, 10) ===
        new Date(selectedDate).toISOString().slice(0, 10)
      ) {
        const tableColor =
          tableColors[reserva.id] || randomColor({ alpha: 0.1 });
        if (!tableColors[reserva.id]) {
          setTableColors((prevTableColors) => ({
            ...prevTableColors,
            [reserva.id]: tableColor,
          }));
        }
        setDisabledIntervals((prevDisabledIntervals) => [
          ...prevDisabledIntervals,
          {
            id: reserva.id.toString(),
            start: new Date(reserva.hora_inicio),
            end: new Date(reserva.hora_fin),
            color: tableColor,
          },
        ]);
      }
    });
  };

  // Mesas vars
  const isTableAvailable = (
    tableId: number,
    restaurantReservations: Reserva[],
    selectedInterval: [Date, Date]
  ): boolean => {
    for (const reserva of restaurantReservations) {
      if (
        reserva.hora_inicio < selectedInterval[1] &&
        reserva.hora_fin > selectedInterval[0] &&
        reserva.mesas.includes(tableId)
      ) {
        return false;
      }
    }
    return true;
  };

  const [tableColors, setTableColors] = useState<{ [key: number]: string }>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submit");

    if (!selectedRestaurant) {
      setError("Debe seleccionar un restaurante");
      setTimeout(() => {
        setError("");
      }, 5000);
      return;
    }

    if (!name) {
      setError("Debe ingresar un nombre");
      setTimeout(() => {
        setError("");
      }, 5000);
      return;
    }

    if (!selectedDate) {
      setError("Debe seleccionar una fecha");
      setTimeout(() => {
        setError("");
      }, 5000);
      return;
    }

    console.log("selectedRestaurant");
    console.log(selectedRestaurant);

    console.log("name");
    console.log(name);

    console.log("selectedDate");
    console.log(selectedDate);

    console.log("mesa");
    console.log(mesa);

    console.log("ci");
    console.log(cedula);

    console.log("selectedInterval");
    console.log(selectedInterval);

    console.log("startTime");
    console.log(startTime);

    console.log("endTime");
    console.log(endTime);

    console.log("disabledIntervals");
    console.log(disabledIntervals);

    console.log("interval 1");
    console.log(selectedInterval[0]);

    console.log("interval 2");
    console.log(selectedInterval[1]);

    console.log("interval 1");
    console.log(selectedInterval[0].getTime());

    console.log("interval 2");
    console.log(selectedInterval[1].getTime());

    console.log("compare time");
    console.log(selectedInterval[0].getTime() > selectedInterval[1].getTime());

    if (selectedInterval[0].getTime() > selectedInterval[1].getTime()) {
      setError("Debe seleccionar un intervalo valido");
      setTimeout(() => {
        setError("");
      }, 5000);
      return;
    }

    if (showCrearCliente) {
      try {
        const newClient = await api.post("/clientes", clienteData);
        // Update the clientes state with the new client
        setClientes((prevClientes) => [...prevClientes, newClient]);
        // Update the cedula state with the new client's cedula
        setCedula(newClient.cedula.toString());
        // Hide the CrearCliente component
        setShowCrearCliente(false);
      } catch (error) {
        console.log(error);
        setError(error?.message ?? "Ocurrio un error al crear el cliente");
        setTimeout(() => {
          setError("");
        }, 5000);
        return;
      }
    }

    api
      .post(`/restaurantes/${selectedRestaurant.id}/reservas`, {
        id_mesa: mesa,
        cedula: cedula,
        fecha: selectedDate,
        hora_fin: selectedInterval[1].toISOString(),
        hora_inicio: selectedInterval[0].toISOString(),
      })
      .then((response) => {
        setError("Reserva creada exitosamente");
        setTimeout(() => {
          setError("");
        }, 5000);

        router.replace(`/restaurantes`);
      })
      .catch((error) => {
        setError(error?.message ?? "Ocurrio un error al crear la reserva");
        setTimeout(() => {
          setError("");
        }, 5000);
      });
  };

  if (loadingRestaurantes) {
    return (
      <Center height={"100vh"}>
        <p>Cargando</p>
      </Center>
    );
  }
  if (restaurants.length === 0) {
    return (
      <Center height={"100vh"}>
        <p>No hay restaurantes disponibles</p>
      </Center>
    );
  }

  return (
    <>
      <Box paddingTop={"10"}>
        <Center>
          <Stack spacing={4} w={"70%"}>
            <Text fontSize={"2xl"} fontWeight={"bold"}>
              Crear Reserva
            </Text>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl id="restaurant" isRequired>
                  <FormLabel>Restaurantes disponibles</FormLabel>
                  <Select
                    placeholder="Selecciona un restaurante"
                    value={name}
                    onChange={(e: any) => {
                      setSelectedRestaurant(
                        restaurants.at(e.target.selectedIndex - 1)
                      );
                      setName(e.target.value);
                      console.log("Se actualizo en el select de restaurantes");
                      updateDisabledIntervals(
                        selectedDate,
                        restaurants.at(e.target.selectedIndex - 1)?.reservas
                      );
                    }}
                    required
                  >
                    {restaurants.map((restaurante) => (
                      <option key={restaurante.id} value={restaurante.nombre}>
                        {restaurante.nombre}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl id="date" isRequired>
                  <FormLabel>Fecha de reserva</FormLabel>
                  <SingleDatepicker
                    date={selectedDate}
                    onDateChange={(date: any) => {
                      setSelectedDate(date);
                      if (selectedRestaurant != null) {
                        console.log("Se actualizo en el datepicker");
                        updateDisabledIntervals(
                          date,
                          selectedRestaurant.reservas
                        );
                      }
                    }}
                    name="date"
                  />
                </FormControl>
                <FormControl id="timeRange" isRequired>
                  <FormLabel>Hora de reserva</FormLabel>
                  <TimeRange
                    selectedInterval={selectedInterval}
                    onChangeCallback={handleChange}
                    step={3600000}
                    disabledIntervals={disabledIntervals}
                    key={1}
                    timelineInterval={[startTime, endTime]}
                    onUpdateCallback={errorHandler}
                    showNow={false}
                    error={errorState}
                  />
                  <Text fontSize={"sm"}>
                    Intervalo seleccionado:{" "}
                    {selectedInterval[0].toLocaleTimeString()} -{" "}
                    {selectedInterval[1].toLocaleTimeString()}
                  </Text>
                </FormControl>
                {selectedRestaurant && (
                  <FormControl id="tables" isRequired>
                    <FormLabel>Mesas</FormLabel>
                    <Select
                      value={mesa}
                      onChange={handleMesaChange}
                      mb={4}
                      required
                    >
                      <option value="">Select an option</option>
                      {selectedRestaurant?.mesas.map((mesa) => (
                        <option key={mesa.id} value={mesa.id}>
                          {mesa.nombre} - (Capacidad = {mesa.capacidad})
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                )}
                <FormControl id="id" isRequired>
                  <FormLabel>CI / RUC</FormLabel>
                  <Select
                    value={cedula}
                    onChange={(e) => {
                      handleCiChange(e);
                      setShowCrearCliente(e.target.value === "0");
                    }}
                    placeholder="Eliga un cliente"
                    required
                  >
                    {clientes.map((cliente) => (
                      <option key={cliente.id} value={cliente.cedula}>
                        {cliente.cedula +
                          "-" +
                          cliente.nombre +
                          " " +
                          cliente.apellido}
                      </option>
                    ))}
                    <option value={cedula ? cedula : "0"}>Nuevo Cliente</option>
                  </Select>
                  {showCrearCliente && (
                    <CrearCliente
                      clienteData={clienteData}
                      setClienteData={setClienteData}
                      setCedula={setCedula}
                    />
                  )}
                </FormControl>
                <Button type="submit" colorScheme="blue">
                  Crear Reserva
                </Button>
              </Stack>
            </form>
          </Stack>
        </Center>
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
    </>
  );
};

export default CrearReserva2;

// Simple reservation creation page with a form and a map with no api calls
"use client";
import React, { useState, useEffect } from "react";
import {
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
import { Reserva, Restaurante } from "@prisma/client";

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

const CrearReserva = () => {
  const [name, setName] = useState<string>("");
  const [restaurants, setRestaurants] = useState<Restaurante[]>([]);
  const [loadingRestaurantes, setLoadingRestaurantes] = useState<boolean>(true);

  const [error, setError] = useState<string>("");
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurante>();
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());

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
        setError("Ocurrio un error al obtener los restaurantes");
        setTimeout(() => {
          setError("");
        }, 5000);
      });
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

    // api
    //   .post(`/restaurantes/${selectedRestaurant.id}/reservas`, {
    //     id_mesa:,
    //     id_cliente: ,
    //     fecha:,
    //     hora_fin:,
    //     hora_inicio:,
    //     cantidad: ,
    //   })
    //   .then((response) => {
    //     console.log("response");
    //     console.log(response);
    //     setError("Reserva creada exitosamente");
    //     setTimeout(() => {
    //       setError("");
    //     }, 5000);
    //   })
    //   .catch((error) => {
    //     setError("Ocurrio un error al crear la reserva");
    //     setTimeout(() => {
    //       setError("");
    //     }, 5000);
    //   });
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

  const [errorState, setErrorState] = useState<boolean>(false);

  const errorHandler = ({ error }: UpdateCallbackData) => {
    setErrorState(error);
  };

  const handleChange = (selectedInterval: [Date, Date]) => {
    setSelectedInterval(selectedInterval);
  };

  const updateDisabledIntervals = (
    selectedDate: Date,
    restaurantReservations: {
      id: number;
      fecha: Date;
      intervalo: DisabledInterval;
    }[]
  ) => {
    setDisabledIntervals([]);
    restaurantReservations.forEach((reserva) => {
      if (
        new Date(reserva.fecha).toISOString().slice(0, 10) ===
        new Date(selectedDate).toISOString().slice(0, 10)
      ) {
        const tableColor =
          tableColors[parseInt(reserva.intervalo.id)] ||
          randomColor({ alpha: 0.1 });
        if (!tableColors[parseInt(reserva.intervalo.id)]) {
          setTableColors((prevTableColors) => ({
            ...prevTableColors,
            [parseInt(reserva.intervalo.id)]: tableColor,
          }));
        }
        setDisabledIntervals((prevDisabledIntervals) => [
          ...prevDisabledIntervals,
          { ...reserva.intervalo, color: tableColor },
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

  console.log(restaurants);

  return (
    <Box height={"100vh"} paddingTop={"10"}>
      <Center>
        <Stack spacing={4} w={"70%"}>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            Crear Reserva
          </Text>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl id="restaurant">
                <FormLabel>Restaurantes disponibles</FormLabel>
                <Select
                  placeholder="Selecciona un restaurante"
                  value={name}
                  onChange={(e: any) => {
                    setSelectedRestaurant(
                      restaurants.at(e.target.selectedIndex - 1)
                    );
                    setName(e.target.value);
                    updateDisabledIntervals(
                      selectedDate,
                      restaurants.at(e.target.selectedIndex - 1)?.reservas || []
                    );
                  }}
                >
                  {restaurants.map((restaurante) => (
                    <option key={restaurante.id} value={restaurante.nombre}>
                      {restaurante.nombre}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl id="date">
                <FormLabel>Fecha de reserva</FormLabel>
                <SingleDatepicker
                  date={selectedDate}
                  onDateChange={(date: any) => {
                    setSelectedDate(date);
                    if (selectedRestaurant != null) {
                      updateDisabledIntervals(
                        date,
                        selectedRestaurant.reservas
                      );
                    }
                  }}
                  name="date"
                />
              </FormControl>
              <FormControl id="timeRange">
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
              <FormControl id="tables">
                <FormLabel>Mesas</FormLabel>
                <List spacing={3}>
                  {selectedRestaurant?.mesas.map((mesa) => {
                    const tableColor =
                      tableColors[mesa.id] || randomColor({ alpha: 0.1 });
                    if (!tableColors[mesa.id]) {
                      setTableColors((prevTableColors) => ({
                        ...prevTableColors,
                        [mesa.id]: tableColor,
                      }));
                    }

                    return (
                      <ListItem key={mesa.id}>
                        <CircleIcon color={tableColor} />
                        <Checkbox
                          value={mesa.id}
                          isDisabled={
                            !isTableAvailable(
                              mesa.id,
                              selectedRestaurant?.reservas || [],
                              selectedInterval
                            )
                          }
                        >
                          {mesa.id}
                        </Checkbox>
                      </ListItem>
                    );
                  })}
                </List>
              </FormControl>
              <FormControl id="id">
                <FormLabel>CI / RUC</FormLabel>
                <Input type="text" />
              </FormControl>
              <Button type="submit" colorScheme="blue">
                Crear Reserva
              </Button>
            </Stack>
          </form>
        </Stack>
      </Center>
    </Box>
  );
};

export default CrearReserva;

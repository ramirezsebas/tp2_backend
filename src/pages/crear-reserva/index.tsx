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

const HomePage = () => {
  const [name, setName] = useState<string>("");
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurante>();
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());

  interface Intervalo {
    id: string;
    start: Date;
    end: Date;
  }

  interface Mesa {
    id: number;
    numSeats: number;
  }

  interface Reserva {
    id: number;
    fecha: Date;
    intervalo: Intervalo;
    mesasReservadas: number[];
  }

  interface Restaurante {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    reservas: Reserva[];
    mesas: Mesa[];
  }

  const restaurants: Restaurante[] = [
    {
      id: 1,
      name: "McDonald's",
      address: "Calle 1",
      phone: "123456789",
      email: "",
      mesas: [
        { id: 1, numSeats: 4 },
        { id: 2, numSeats: 2 },
        { id: 3, numSeats: 6 },
      ],
      reservas: [
        {
          id: 1,
          fecha: new Date(Date.parse("2023-04-26 00:00")),
          intervalo: {
            id: "1",
            start: new Date(Date.parse("2023-04-26 7:00")),
            end: new Date(Date.parse("2023-04-26 8:00")),
          },
          mesasReservadas: [1, 2],
        },
        {
          id: 2,
          fecha: new Date(Date.parse("2023-04-26 00:00")),
          intervalo: {
            id: "2",
            start: new Date(Date.parse("2023-04-26 9:00")),
            end: new Date(Date.parse("2023-04-26 10:00")),
          },
          mesasReservadas: [3],
        },
        // Add more reservas as needed
      ],
    },
    {
      id: 2,
      name: "Burger King",
      address: "Calle 2",
      phone: "123456789",
      email: "",
      mesas: [
        { id: 1, numSeats: 4 },
        { id: 2, numSeats: 2 },
        { id: 3, numSeats: 6 },
      ],
      reservas: [
        {
          id: 1,
          fecha: new Date(Date.parse("2023-04-26 00:00")),
          intervalo: {
            id: "1",
            start: new Date(Date.parse("2023-04-26 12:00")),
            end: new Date(Date.parse("2023-04-26 14:00")),
          },
          mesasReservadas: [1],
        },
        {
          id: 2,
          fecha: new Date(Date.parse("2023-04-26 00:00")),
          intervalo: {
            id: "2",
            start: new Date(Date.parse("2023-04-26 14:00")),
            end: new Date(Date.parse("2023-04-26 16:00")),
          },
          mesasReservadas: [2, 3],
        },
        // Add more reservas as needed
      ],
    },
    {
      id: 3,
      name: "Bacon",
      address: "Calle 3",
      phone: "123456789",
      email: "",
      mesas: [
        { id: 1, numSeats: 4 },
        { id: 2, numSeats: 2 },
        { id: 3, numSeats: 6 },
      ],
      reservas: [
        {
          id: 1,
          fecha: new Date(Date.parse("2023-04-26 00:00")),
          intervalo: {
            id: "1",
            start: new Date(Date.parse("2023-04-26 12:00")),
            end: new Date(Date.parse("2023-04-26 14:00")),
          },
          mesasReservadas: [1, 3],
        },
        {
          id: 2,
          fecha: new Date(Date.parse("2023-04-26 00:00")),
          intervalo: {
            id: "2",
            start: new Date(Date.parse("2023-04-26 14:00")),
            end: new Date(Date.parse("2023-04-26 16:00")),
          },
          mesasReservadas: [2],
        },
        {
          id: 3,
          fecha: new Date(Date.parse("2023-04-27 00:00")),
          intervalo: {
            id: "3",
            start: new Date(Date.parse("2023-04-27 17:00")),
            end: new Date(Date.parse("2023-04-27 18:00")),
          },
          mesasReservadas: [1, 2],
        },
        {
          id: 4,
          fecha: new Date(Date.parse("2023-04-27 00:00")),
          intervalo: {
            id: "4",
            start: new Date(Date.parse("2023-04-27 14:00")),
            end: new Date(Date.parse("2023-04-27 16:00")),
          },
          mesasReservadas: [3],
        },
      ],
    },
  ];

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submit");
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
        reserva.fecha.toISOString().slice(0, 10) ===
        selectedDate.toISOString().slice(0, 10)
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
        reserva.intervalo.start < selectedInterval[1] &&
        reserva.intervalo.end > selectedInterval[0] &&
        reserva.mesasReservadas.includes(tableId)
      ) {
        return false;
      }
    }
    return true;
  };

  const [tableColors, setTableColors] = useState<{ [key: number]: string }>({});

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
                  onChange={(e) => {
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
                    <option key={restaurante.id} value={restaurante.name}>
                      {restaurante.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl id="date">
                <FormLabel>Fecha de reserva</FormLabel>
                <SingleDatepicker
                  date={selectedDate}
                  onDateChange={(date) => {
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

export default HomePage;

import { Mesa, Restaurante } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ApiService } from "@/data/api_service";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { endOfToday, set } from "date-fns";
import {
  Interval,
  TimeRange,
} from "@matiaslgonzalez/react-timeline-range-slider";

const now = new Date();
const getTodayAtSpecificHour = (hour = 12) =>
  set(now, { hours: hour, minutes: 0, seconds: 0, milliseconds: 0 });

const selectedStart = getTodayAtSpecificHour(12);
const selectedEnd = getTodayAtSpecificHour(13);

const startTime = getTodayAtSpecificHour(12);
const endTime = endOfToday();

export default function RestauranteScreen() {
  const router = useRouter();
  const { id } = router.query;

  const [restaurante, setRestaurante] = useState<Restaurante | null>(null);
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mesaSeleccionada, setMesaSeleccionada] = useState<Mesa | null>(null);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<Date[]>([]);
  const [capacidad, setCapacidad] = useState<number>(0);

  const seleccionarMesa = (mesa: any) => {
    setMesaSeleccionada(mesa);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  const filterMesas = (mesas: Mesa[]) => {
    return mesas.filter((mesa) => mesa.capacidad >= capacidad);
  };

  useEffect(() => {
    if (id) {
      const api = new ApiService();
      setLoading(true);
      api
        .get(`/restaurantes/${id}`)
        .then((res) => {
          setRestaurante(res);

          api
            .get(`/restaurantes/${id}/mesas`)
            .then((res) => {
              setMesas(res);
              setLoading(false);
            })
            .catch((err) => {
              setError(err.message);
              setLoading(false);
            });
        })
        .catch((err) => {
          setLoading(false);
          setError(err.message);
        });
    }
  }, [id]);

  if (loading) return <p>Cargando...</p>;

  if (error) return <p>{error}</p>;

  return (
    <>
      <Center>
        <Heading as="h1" size="lg" mb={2}>
          Reservar
        </Heading>
      </Center>
      <Box p={4} borderWidth="1px" borderRadius="lg">
        <Heading as="h2" size="lg" mb={2}>
          {restaurante?.nombre}
        </Heading>
        <p>{restaurante?.direccion}</p>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Capacidad</FormLabel>
              <Input
                type="number"
                placeholder="Ingrese la capacidad"
                onChange={(e) => setCapacidad(parseInt(e.target.value))}
              />

              <FormLabel>Fecha de la reserva</FormLabel>
              <Input
                type="date"
                value={selectedDate}
                placeholder="Ingrese la fecha de la reserva"
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </FormControl>
            {selectedDate && (
              <>
                <FormLabel>Agregar Horario</FormLabel>
                <Box width={"100%"}>
                  <TimeRange
                    step={60 * 60 * 1000}
                    ticksNumber={36}
                    error={error.length > 0}
                    selectedInterval={[selectedStart, selectedEnd]}
                    timelineInterval={[startTime, endTime]}
                    onUpdateCallback={(value) => {
                      if (!value.error) {
                        setError("");
                      } else {
                        setError("Please select a valid interval");
                      }
                    }}
                    onChangeCallback={(selectedInterval) => {
                      setSelectedTime(selectedInterval);
                    }}
                  />
                </Box>
              </>
            )}
          </VStack>
        </form>
        {selectedDate && selectedTime && capacidad && (
          <>
            <Heading as="h3" size="md" mb={2}>
              Mesas:
            </Heading>
            {filterMesas(mesas).length === 0 ? (
              <p>No hay mesas registradas</p>
            ) : (
              <UnorderedList>
                {filterMesas(mesas).map((mesa) => (
                  <ListItem
                    key={mesa.id}
                    bg={
                      mesaSeleccionada?.id === mesa.id
                        ? "gray.200"
                        : "transparent"
                    }
                    _hover={{ cursor: "pointer" }}
                    onClick={() => seleccionarMesa(mesa)}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <p
                        style={
                          mesaSeleccionada?.id === mesa.id
                            ? {
                                fontWeight: "bold",
                                fontSize: "1.2rem",
                                color: "blue",
                              }
                            : {}
                        }
                      >
                        Mesa {mesa.nombre} - Capacidad: {mesa.capacidad}
                      </p>
                      <Button>Seleccionar</Button>
                    </Box>
                  </ListItem>
                ))}
              </UnorderedList>
            )}
          </>
        )}
        <Button
          mt={4}
          colorScheme="teal"
          type="submit"
          onClick={() => {
            if (mesaSeleccionada && selectedDate && selectedTime) {
              const api = new ApiService();
              api
                .post(`/restaurantes/${id}/reservas`, {
                  mesa_id: mesaSeleccionada.id,
                  fecha: selectedDate,
                  hora_inicio: selectedTime[0],
                  hora_fin: selectedTime[1],
                })
                .then((res) => {
                  console.log(res);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          }}
        >
          Reservar
        </Button>
      </Box>
    </>
  );
}

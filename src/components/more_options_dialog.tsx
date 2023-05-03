import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { endOfToday, set } from "date-fns";
import {
  Interval,
  TimeRange,
} from "@matiaslgonzalez/react-timeline-range-slider";
import { Mesa } from "@prisma/client";
import { ApiService } from "@/data/api_service";

const now = new Date();
const getTodayAtSpecificHour = (hour = 12) =>
  set(now, { hours: hour, minutes: 0, seconds: 0, milliseconds: 0 });

const selectedStart = getTodayAtSpecificHour(12);
const selectedEnd = getTodayAtSpecificHour(13);

const startTime = getTodayAtSpecificHour(12);
const endTime = endOfToday();

const disabledIntervals = [
  {
    id: "1",
    start: getTodayAtSpecificHour(7),
    end: getTodayAtSpecificHour(11),
  },
  //   {
  //     id: "2",
  //     start: getTodayAtSpecificHour(12),
  //     end: getTodayAtSpecificHour(14),
  //   },
  //   {
  //     id: "3",
  //     start: getTodayAtSpecificHour(12),
  //     end: getTodayAtSpecificHour(15),
  //   },
  //   {
  //     id: "4",
  //     start: getTodayAtSpecificHour(12),
  //     end: getTodayAtSpecificHour(16),
  //   },
  //   {
  //     id: "5",
  //     start: getTodayAtSpecificHour(12),
  //     end: getTodayAtSpecificHour(17),
  //   },

  //   {
  //     id: "3",
  //     start: getTodayAtSpecificHour(21),
  //     end: getTodayAtSpecificHour(24),
  //   },
];

export function MoreOptionsDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<Date[]>([]);
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [selectedMesa, setSelectedMesa] = useState<Mesa>();
  const [loadingMesas, setLoadingMesas] = useState<boolean>(false);

  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onClose();
    setSelectedDate("");
    setSelectedTime([]);
  };

  const api = new ApiService();

  const getMesas = async () => {
    try {
      setLoadingMesas(true);
      const response = await api.get("/mesas");
      const data = response;
      console.log(data);
      setMesas(data);
      setLoadingMesas(false);
    } catch (error) {
      setLoadingMesas(false);
      setError(error as string);
      console.log(error);
    }
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={() => {
        setSelectedDate("");
        setSelectedTime([]);
        onClose();
      }}
      leastDestructiveRef={cancelRef}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Agregar Mesa o Reserva
          </AlertDialogHeader>

          <Tabs index={selectedTab} onChange={(index) => setSelectedTab(index)}>
            <TabList>
              <Tab>Agregar Mesa</Tab>
              <Tab>Agregar Reserva</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <AlertDialogBody>
                  <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Número de mesa</FormLabel>
                        <Input
                          type="number"
                          placeholder="Ingrese el número de mesa"
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Capacidad de la mesa</FormLabel>
                        <Input
                          type="number"
                          placeholder="Ingrese la capacidad de la mesa"
                        />
                      </FormControl>
                      <Button type="submit" colorScheme="green">
                        Agregar Mesa
                      </Button>
                    </VStack>
                  </form>
                </AlertDialogBody>
              </TabPanel>
              <TabPanel>
                <AlertDialogBody>
                  <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                      <FormControl isRequired>
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

                      {selectedDate &&
                      selectedTime.length > 0 &&
                      loadingMesas ? (
                        <Center>
                          <Spinner />
                        </Center>
                      ) : (
                        <Menu>
                          <MenuButton
                            as={Button}
                            onClick={() => {
                              getMesas()
                                .then(() => {})
                                .catch((error) => console.log(error));
                            }}
                          >
                            {selectedMesa
                              ? selectedMesa.nombre
                              : "Selecciona una mesa"}
                          </MenuButton>
                          <MenuList>
                            {mesas.map((mesa) => (
                              <MenuItem
                                key={mesa.id}
                                onClick={() => setSelectedMesa(mesa)}
                              >
                                {mesa.nombre}
                              </MenuItem>
                            ))}
                          </MenuList>
                        </Menu>
                      )}
                      <Button type="submit" colorScheme="green">
                        Agregar Reserva
                      </Button>
                    </VStack>
                  </form>
                </AlertDialogBody>
              </TabPanel>
            </TabPanels>
          </Tabs>
          <AlertDialogFooter>
            <Button
              onClick={() => {
                setSelectedDate("");
                setSelectedTime([]);
                onClose();
              }}
            >
              Cancelar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

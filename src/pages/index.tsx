import { AbsoluteCenter, Box, Button, HStack } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";

function CrearReserva(): JSX.Element {
  return (
    <Box height={"100vh"}>
      <AbsoluteCenter>
        <HStack spacing={4}>
          <Link
            href="/crear-reserva"
            color="blue.400"
            _hover={{ color: "blue.500" }}
          >
            <Button colorScheme="blue">Crear reserva</Button>
          </Link>
          <Button colorScheme="blue">Listar Reservas</Button>
        </HStack>
      </AbsoluteCenter>
    </Box>
  );
}

export default CrearReserva;

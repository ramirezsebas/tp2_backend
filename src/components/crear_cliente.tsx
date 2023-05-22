import React from "react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import { set } from "lodash";

interface CrearClienteProps {
  clienteData: {
    nombre: string;
    apellido: string;
    cedula: number;
  };
  setClienteData: React.Dispatch<
    React.SetStateAction<{
      nombre: string;
      apellido: string;
      cedula: number;
    }>
  >;
  setCedula: React.Dispatch<React.SetStateAction<string>>;
}

const CrearCliente: React.FC<CrearClienteProps> = ({
  clienteData,
  setClienteData,
  setCedula,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClienteData({
      ...clienteData,
      [event.target.name]: event.target.value,
    });
    if (event.target.name === "cedula") {
      setCedula(event.target.value.toString());
    }
  };

  return (
    <VStack spacing={4}>
      <FormControl isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          placeholder="Nombre del Cliente"
          name="nombre"
          value={clienteData.nombre}
          onChange={handleInputChange}
          required
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Apellido</FormLabel>
        <Input
          type="text"
          placeholder="Ingrese apellido"
          name="apellido"
          value={clienteData.apellido}
          onChange={handleInputChange}
          required
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Cedula</FormLabel>
        <Input
          type="number"
          placeholder="Ingrese cedula"
          name="cedula"
          value={clienteData.cedula}
          onChange={handleInputChange}
          required
        />
      </FormControl>
    </VStack>
  );
};

export default CrearCliente;

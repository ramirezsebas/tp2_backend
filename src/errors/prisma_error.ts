export function mapPrismaClientError(errorCode: string) {
  switch (errorCode) {
    case "P101":
      return "La URL de la base de datos es inválida o tiene un formato incorrecto.";
    case "P102":
      return "No se pudo conectar al servidor de la base de datos o se rechazó la conexión.";
    case "P103":
      return "No se pudo autenticar con la base de datos debido a que las credenciales proporcionadas son inválidas o insuficientes.";
    case "P104":
      return "No se pudo inicializar el cliente de Prisma porque el archivo 'schema.prisma' no se encontró o tiene un formato incorrecto.";
    case "P105":
      return "No se pudo inicializar el cliente de Prisma porque hubo un error al analizar el archivo 'schema.prisma'.";
    case "P106":
      return "No se pudo inicializar el cliente de Prisma porque no se pudo generar el esquema de Prisma a partir del archivo 'schema.prisma'.";
    case "P107":
      return "No se pudo inicializar el cliente de Prisma debido a que hubo un error durante el proceso de migración de la base de datos.";
    case "P108":
      return "No se pudo inicializar el cliente de Prisma debido a que hubo un error durante el proceso de generación del cliente.";
    default:
      return "Ocurrió un error desconocido al inicializar el cliente de Prisma.";
  }
}

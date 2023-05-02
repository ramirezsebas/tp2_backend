import { Interval } from "@matiaslgonzalez/react-timeline-range-slider";

export interface Mesa {
  id: number;
  numSeats: number;
}

export interface Reserva {
  id: number;
  fecha: Date;
  intervalo: Interval;
  mesasReservadas: number[];
}

export interface Restaurante {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  reservas: Reserva[];
  mesas: Mesa[];
}

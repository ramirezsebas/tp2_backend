import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { ConsumoMesa, DetalleConsumo } from '@prisma/client';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
});

type Consumos2PDFProps = {
    consumos: ConsumoMesa[];
}

const Consumos2PDF = ({ consumos }: Consumos2PDFProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text>Consumos:</Text>
                {consumos.map(consumo => (
                    <>
                        <Text>Consumo ID: {consumo.id}</Text>
                        <Text>Mesa ID: {consumo.id_mesa}</Text>
                        <Text>Cliente ID: {consumo.id_cliente}</Text>
                        <Text>Restaurante ID: {consumo.id_restaurante}</Text>
                        <Text>Estado: {consumo.estado}</Text>
                        <Text>Total: {consumo.total}</Text>
                        <Text>Fecha de Creación: {consumo.fechaCreacion.toString()}</Text>
                        <Text>Fecha de Cierre: {consumo.fechaCierra?.toString()}</Text>
                        {consumo.DetalleConsumo.map(detalle) => (
                        <>
                            <Text>Detalle ID: {detalle.id}</Text>
                            <Text>Producto ID: {detalle.id_producto}</Text>
                            <Text>Cantidad: {detalle.cantidad}</Text>
                            <Text>Precio: {detalle.precio}</Text>
                            <Text>Total: {detalle.total}</Text>
                        </>
                        )}
                    </>
                ))}
            </View>
        </Page>
    </Document>
);

export default Consumos2PDF;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper,
} from '@mui/material';
import './detailtable_styles.css';
import config from '../../config';  // Asegúrate de importar la configuración

const DetailTable = () => {
    const [detailData, setDetailData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${config.API_URL}/record/person/1`);
                setDetailData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const formatAmount = (amount) => {
        return `${amount.toFixed(2)} €`;
    };

    const totalAmount = detailData.reduce((total, row) => total + row.amount, 0);

    return (
        <div className="grid-item">
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {/* <TableCell>Id</TableCell> */}
                            <TableCell>Fecha</TableCell>
                            <TableCell>Concepto</TableCell>
                            <TableCell>Descripcion</TableCell>
                            <TableCell>Cantidad</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {detailData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No hay datos en la tabla
                                </TableCell>
                            </TableRow>
                        ) : (
                            detailData.map((row, index) => (
                                <TableRow key={index}>
                                    {/* <TableCell>{row.id}</TableCell> */}
                                    <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{row.concept}</TableCell>
                                    <TableCell>{row.description}</TableCell>
                                    <TableCell style={{ color: row.amount > 0 ? 'green' : 'red' }}>
                                        {formatAmount(row.amount)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell></TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>
                                {formatAmount(totalAmount)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default DetailTable;

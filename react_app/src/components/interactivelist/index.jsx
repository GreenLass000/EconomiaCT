import React, { useState, useEffect, useCallback } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Dialog, DialogTitle,
    DialogContent, DialogActions, Button, Grid
} from '@mui/material';
import axios from 'axios';
import config from '../../config'; // Importar la configuración
import './interactivelist_styles.css';

const InteractiveList = () => {
    const [selectedRow, setSelectedRow] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [persons, setPersons] = useState([]);
    const [detailData, setDetailData] = useState([]);

    const fetchPersonBalance = async (personId) => {
        try {
            const response = await axios.get(`${config.API_URL}/record/person/${personId}`);
            const records = response.data;
            const balance = records.reduce((total, record) => total + record.amount, 0);
            return balance;
        } catch (error) {
            console.error('Error fetching person balance:', error);
            return 0;
        }
    };

    const fetchPersons = useCallback(async () => {
        try {
            const response = await axios.get(`${config.API_URL}/persons/active`);
            const activePersons = await Promise.all(response.data.map(async person => {
                const balance = await fetchPersonBalance(person.id);
                return {
                    id: person.id,
                    firstName: person.firstName,
                    lastName: person.lastName,
                    name: `${person.lastName}, ${person.firstName}`,
                    balance
                };
            }));

            // Filtrar las personas que no sean "Comunidad Terapeutica"
            const filteredPersons = activePersons.filter(person =>
                !(person.firstName.toLowerCase() === 'comunidad' && person.lastName.toLowerCase() === 'terapeutica')
            );

            setPersons(filteredPersons);
        } catch (error) {
            console.error('Error fetching persons list:', error);
        }
    }, []); // No dependencies needed since fetchPersons doesn't rely on props or state

    const handleRowClick = async (row) => {
        setSelectedRow(row);
        try {
            const response = await axios.get(`${config.API_URL}/record/person/${row.id}`);
            setDetailData(response.data);
        } catch (error) {
            console.error('Error fetching person details:', error);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRow(null);
        setDetailData([]);
    };

    const handleDeletePerson = async () => {
        try {
            await axios.patch(`${config.API_URL}/person/delete/${selectedRow.id}`);
            setPersons(persons.filter(person => person.id !== selectedRow.id));
            handleCloseModal();
        } catch (error) {
            console.error('Error deleting person:', error);
        }
    };

    const formatBalance = (balance) => {
        const formattedBalance = balance.toFixed(2) + ' €';
        const balanceStyle = { color: balance >= 0 ? 'green' : 'red' };
        return <span style={balanceStyle}>{formattedBalance}</span>;
    };

    useEffect(() => {
        fetchPersons();
    }, [fetchPersons]);

    return (
        <div className="grid-item">
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Saldo</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {persons.map((row) => (
                            <TableRow key={row.id} hover onClick={() => handleRowClick(row)}>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{formatBalance(row.balance)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                            Detalles de {selectedRow?.name}
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleDeletePerson}
                            >
                                Dar de baja
                            </Button>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <DialogContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Concepto</TableCell>
                                <TableCell>Descripcion</TableCell>
                                <TableCell>Cantidad</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {detailData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{row.concept}</TableCell>
                                    <TableCell>{row.description}</TableCell>
                                    <TableCell>{formatBalance(row.amount)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default InteractiveList;

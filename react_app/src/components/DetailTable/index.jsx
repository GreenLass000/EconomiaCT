import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    Snackbar, Alert, IconButton, Paper
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import './detailtable_styles.css';
import config from '../../config';
import CustomTextBox from '../CustomTextBox';

const DetailTable = () => {
    const [detailData, setDetailData] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [selectedId, setSelectedId] = useState(null);
    const [editingRecord, setEditingRecord] = useState(null);

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

    const handleDeleteClick = (id) => {
        setSelectedId(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`${config.API_URL}/record/${selectedId}`);
            setDetailData(detailData.filter(row => row.id !== selectedId));
            setDeleteDialogOpen(false);
            setSnackbar({ open: true, message: 'Registro eliminado correctamente', severity: 'success' });
        } catch (error) {
            console.error('Error deleting record:', error);
            setSnackbar({ open: true, message: 'Error al eliminar el registro', severity: 'error' });
        }
    };

    const handleEdit = (row) => {
        setEditingRecord({ ...row });
        setEditDialogOpen(true);
    };

    const handleEditSave = async () => {
        try {
            await axios.put(`${config.API_URL}/record/${editingRecord.id}`, editingRecord);
            setDetailData(detailData.map(item => (item.id === editingRecord.id ? editingRecord : item)));
            setEditDialogOpen(false);
            setSnackbar({ open: true, message: 'Registro actualizado correctamente', severity: 'success' });
        } catch (error) {
            console.error('Error updating record:', error);
            setSnackbar({ open: true, message: 'Error al actualizar el registro', severity: 'error' });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditingRecord(prev => ({
            ...prev,
            [name]: name === 'amount' ? parseFloat(value) || 0 : value
        }));
    };

    const formatAmount = (amount) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
    const totalAmount = detailData.reduce((total, row) => total + row.amount, 0);

    return (
        <div className="grid-item">
            <CustomTextBox text="Caja Comunidad Terapeutica" />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ fontWeight: 'bold' }}>Fecha</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Concepto</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Descripción</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }} align="right">Cantidad</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }} align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={3} align="left" style={{ fontWeight: 'bold' }}>
                                Saldo:
                            </TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold', color: totalAmount >= 0 ? 'green' : 'red' }}>
                                {formatAmount(totalAmount)}
                            </TableCell>
                            <TableCell />
                        </TableRow>
                        {detailData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No hay datos en la tabla
                                </TableCell>
                            </TableRow>
                        ) : (
                            detailData.map(row => (
                                <TableRow key={row.id}>
                                    <TableCell>{new Date(row.date).toLocaleDateString('es-ES')}</TableCell>
                                    <TableCell>{row.concept}</TableCell>
                                    <TableCell>{row.description}</TableCell>
                                    <TableCell align="right" style={{ color: row.amount >= 0 ? 'green' : 'red' }}>
                                        {formatAmount(row.amount)}
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={() => handleEdit(row)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteClick(row.id)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>¿Estás seguro?</DialogTitle>
                <DialogContent>
                    Esta acción no se puede deshacer. Se eliminará permanentemente este registro.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleDeleteConfirm} color="error">Eliminar</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Editar Registro</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Concepto"
                        name="concept"
                        value={editingRecord?.concept || ''}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Descripción"
                        name="description"
                        value={editingRecord?.description || ''}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Cantidad"
                        name="amount"
                        type="number"
                        value={editingRecord?.amount || ''}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleEditSave} color="primary">Guardar</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default DetailTable;

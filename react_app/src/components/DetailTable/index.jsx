import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import './detailtable_styles.css';
import CustomTextBox from '../CustomTextBox';
import DeleteDialog from './components/DeleteDialog';
import EditDialog from './components/EditDialog';
import FeedbackSnackbar from './components/FeedbackSnackbar';
import TableBodyContent from './components/TableBodyContent';
import { GridItem } from './styles';

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
        const response = await axios.get(`http://192.168.1.117:5000/record/person/1`);
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
      await axios.delete(`http://192.168.1.117:5000/record/${selectedId}`);
      setDetailData(detailData.filter(row => row.id !== selectedId));
      setSnackbar({ open: true, message: 'Registro eliminado correctamente', severity: 'success' });
    } catch (error) {
      console.error('Error deleting record:', error);
      setSnackbar({ open: true, message: 'Error al eliminar el registro', severity: 'error' });
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleEdit = (row) => {
    setEditingRecord({ ...row });
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    try {
      await axios.put(`http://192.168.1.117:5000/record/${editingRecord.id}`, editingRecord);
      setDetailData(detailData.map(item => (item.id === editingRecord.id ? editingRecord : item)));
      setSnackbar({ open: true, message: 'Registro actualizado correctamente', severity: 'success' });
    } catch (error) {
      console.error('Error updating record:', error);
      setSnackbar({ open: true, message: 'Error al actualizar el registro', severity: 'error' });
    } finally {
      setEditDialogOpen(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingRecord(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <GridItem>
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
            <TableBodyContent
              data={detailData}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          </TableBody>
        </Table>
      </TableContainer>

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      <EditDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleEditSave}
        record={editingRecord}
        onChange={handleInputChange}
      />

      <FeedbackSnackbar
        snackbar={snackbar}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </GridItem>
  );
};

export default DetailTable;

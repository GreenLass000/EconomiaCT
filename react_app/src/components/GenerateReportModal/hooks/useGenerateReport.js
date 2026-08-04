import { useState, useEffect } from 'react';
import api from '../../../api';

export const useGenerateReport = () => {
  const [persons, setPersons] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState('');
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-01-01`;
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  useEffect(() => {
    api.get('/persons/active')
      .then(response => setPersons(response.data));
  }, []);

  const downloadReport = async ({ endpoint, queryParams, filename }) => {
    setLoading(true);
    try {
      const query = new URLSearchParams(queryParams);
      const response = await api.get(`${endpoint}?${query.toString()}`, { responseType: 'blob' });
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Error al generar el reporte', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handlePdfSubmit = async () => {
    if (!selectedPerson || !startDate || !endDate) return;

    const person = persons.find(p => String(p.id) === String(selectedPerson));
    if (!person) return;

    await downloadReport({
      endpoint: '/report',
      queryParams: {
        person_id: selectedPerson,
        start_date: startDate,
        end_date: endDate,
      },
      filename: `${person.firstName}_${person.lastName}_report.pdf`,
    });
  };

  const handleExcelSubmit = async () => {
    if (!startDate || !endDate) return;

    await downloadReport({
      endpoint: '/report/excel',
      queryParams: {
        start_date: startDate,
        end_date: endDate,
      },
      filename: `reporte_${startDate}_${endDate}.xlsx`,
    });
  };

  const closeSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return {
    persons, selectedPerson, startDate, endDate,
    loading, snackbar,
    setSelectedPerson, setStartDate, setEndDate,
    handlePdfSubmit, handleExcelSubmit, closeSnackbar
  };
};

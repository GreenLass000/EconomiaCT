import { useState, useEffect } from 'react';

export const useGenerateReport = () => {
  const [persons, setPersons] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState('');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  useEffect(() => {
    fetch('http://192.168.1.118:5000/persons/active')
      .then(res => res.json())
      .then(data => setPersons(data));
  }, []);

  const handleSubmit = async () => {
    if (!selectedPerson || !startDate || !endDate) return;

    setLoading(true);
    try {
      const query = new URLSearchParams({
        person_id: selectedPerson,
        start_date: startDate,
        end_date: endDate,
      });
      const response = await fetch(`http://192.168.1.118:5000/report?${query.toString()}`);
      if (!response.ok) throw new Error('Error al generar el reporte');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      const person = persons.find(p => p.id === selectedPerson);
      a.href = url;
      a.download = `${person.firstName}_${person.lastName}_report.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Error al generar el reporte', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const closeSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return {
    persons, selectedPerson, startDate, endDate,
    loading, snackbar,
    setSelectedPerson, setStartDate, setEndDate,
    handleSubmit, closeSnackbar
  };
};

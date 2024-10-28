import React, { useState, useEffect } from 'react';
import {
  TextField,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Checkbox,
  Grid,
  Button
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import axios from 'axios';
import { API_SERVER, API_PORT } from '../../config';

const NewIncomeSpentModal = ({ onSubmit }) => {
  const [selectedType, setSelectedType] = useState('gasto');
  const [isConcerted, setIsConcerted] = useState(false);
  const [incomeAmount, setIncomeAmount] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [name, setName] = useState('');
  const [incomeItem, setIncomeItem] = useState('');
  const [expenseItem, setExpenseItem] = useState('');
  const [incomeList, setIncomeList] = useState([]);
  const [spentList, setSpentList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [personList, setPersonList] = useState([]);
  const [description, setDescription] = useState('');

  // Fetch the income list
  useEffect(() => {
    const fetchIncomeList = async () => {
      try {
        const response = await axios.get(`http://${API_SERVER}:${API_PORT}/incomelists`);
        setIncomeList(response.data);
      } catch (error) {
        console.error('Error fetching income list:', error);
      }
    };
    fetchIncomeList();
  }, []);

  // Fetch the spent list
  useEffect(() => {
    const fetchSpentList = async () => {
      try {
        const response = await axios.get(`http://${API_SERVER}:${API_PORT}/spentlists`);
        setSpentList(response.data);
      } catch (error) {
        console.error('Error fetching spent list:', error);
      }
    };
    fetchSpentList();
  }, []);

  // Fetch the person list
  useEffect(() => {
    const fetchPersonList = async () => {
      try {
        const response = await axios.get(`http://${API_SERVER}:${API_PORT}/persons/active`);
        setPersonList(response.data);
      } catch (error) {
        console.error('Error fetching person list:', error);
      }
    };
    fetchPersonList();
  }, []);

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleConcertedChange = (event) => {
    setIsConcerted(event.target.checked);
  };

  const handleIncomeAmountChange = (event) => {
    setIncomeAmount(event.target.value);
  };

  const handleExpenseAmountChange = (event) => {
    setExpenseAmount(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleIncomeItemChange = (event) => {
    setIncomeItem(event.target.value);
  };

  const handleExpenseItemChange = (event) => {
    const selectedExpense = spentList.find(expense => expense.name === event.target.value);
    setExpenseItem(event.target.value);
    if (selectedExpense) {
      setIsConcerted(selectedExpense.isconcertado === 1);
    }
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !name ||
      (selectedType === 'ingreso' && (!incomeItem || !incomeAmount)) ||
      (selectedType === 'gasto' && (!expenseItem || !expenseAmount))
    ) {
      alert('Por favor complete todos los campos obligatorios.');
      return;
    }

    const person = personList.find(person => `${person.firstName} ${person.lastName}` === name);

    const formData = {
      person_id: person.id,
      concept: selectedType === 'ingreso' ? incomeItem : expenseItem,
      amount: selectedType === 'ingreso' ? incomeAmount : -(expenseAmount),
      description,
      date: selectedDate,
      isconcertado: isConcerted
    };

    try {
      await axios.post(`http://${API_SERVER}:${API_PORT}/record`, formData);
      onSubmit(formData);
      window.location.reload();
    } catch (error) {
      console.error('Error al añadir el registro:', error);
      alert('Hubo un error al añadir el registro. Por favor, inténtelo de nuevo.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        id="name"
        name="name"
        fullWidth
        select
        label="Nombre"
        variant="outlined"
        value={name}
        onChange={handleNameChange}
        required
      >
        {personList.length > 0 ? (
          personList.map((person) => (
            <MenuItem key={person.id} value={`${person.firstName} ${person.lastName}`}>
              {person.firstName} {person.lastName}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>
            No hay personas disponibles
          </MenuItem>
        )}
      </TextField>

      <FormControl component="fieldset" style={{ marginTop: 16 }}>
        <FormLabel component="legend">Tipo</FormLabel>
        <RadioGroup
          row
          name="type"
          value={selectedType}
          onChange={handleTypeChange}
        >
          <FormControlLabel
            value="ingreso"
            control={<Radio />}
            label="Ingreso"
          />
          <FormControlLabel
            value="gasto"
            control={<Radio />}
            label="Gasto"
          />
        </RadioGroup>
      </FormControl>

      <Grid container spacing={2} style={{ marginTop: 16 }}>
        <Grid item xs={6}>
          <TextField
            id="incomeItem"
            name="incomeItem"
            fullWidth
            select
            label="Lista de Ingresos"
            variant="outlined"
            disabled={selectedType !== 'ingreso'}
            value={incomeItem}
            onChange={handleIncomeItemChange}
            required={selectedType === 'ingreso'}
          >
            {incomeList.length > 0 ? (
              incomeList.map((income) => (
                <MenuItem key={income.id} value={income.name}>
                  {income.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>
                No hay ingresos disponibles
              </MenuItem>
            )}
          </TextField>
          <TextField
            id="incomeAmount"
            name="incomeAmount"
            fullWidth
            label="Cantidad"
            variant="outlined"
            type="number"
            value={incomeAmount}
            onChange={handleIncomeAmountChange}
            disabled={selectedType !== 'ingreso'}
            style={{ marginTop: 16 }}
            required={selectedType === 'ingreso'}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            id="expenseItem"
            name="expenseItem"
            fullWidth
            select
            label="Lista de Gastos"
            variant="outlined"
            disabled={selectedType !== 'gasto'}
            value={expenseItem}
            onChange={handleExpenseItemChange}
            required={selectedType === 'gasto'}
          >
            {spentList.length > 0 ? (
              spentList.map((expense) => (
                <MenuItem key={expense.id} value={expense.name}>
                  {expense.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>
                No hay gastos disponibles
              </MenuItem>
            )}
          </TextField>
          <TextField
            id="expenseAmount"
            name="expenseAmount"
            fullWidth
            label="Cantidad"
            variant="outlined"
            type="number"
            value={expenseAmount}
            onChange={handleExpenseAmountChange}
            disabled={selectedType !== 'gasto'}
            style={{ marginTop: 16 }}
            required={selectedType === 'gasto'}
          />
          <FormControlLabel
            control={
              <Checkbox
                id="isConcerted"
                name="isConcerted"
                checked={isConcerted}
                onChange={handleConcertedChange}
                disabled={selectedType !== 'gasto'}
              />
            }
            label="Gasto concertado"
            style={{ marginTop: 16 }}
          />
        </Grid>
      </Grid>

      <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
        <DatePicker
          label="Fecha"
          value={selectedDate}
          onChange={(newDate) => {
            setSelectedDate(newDate);
          }}
          renderInput={(params) => <TextField {...params} fullWidth />}
        // inputFormat="dd-MM-yyyy"
        />
      </LocalizationProvider>

      <TextField
        id="description"
        name="description"
        fullWidth
        label="Descripción"
        variant="outlined"
        style={{ marginTop: 16 }}
        value={description}
        onChange={handleDescriptionChange}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        style={{ marginTop: 16 }}
        disabled={
          !name ||
          (selectedType === 'ingreso' && (!incomeItem || !incomeAmount)) ||
          (selectedType === 'gasto' && (!expenseItem || !expenseAmount))
        }
      >
        Añadir {selectedType === 'ingreso' ? 'Ingreso' : 'Gasto'}
      </Button>
    </form>
  );
};

export default NewIncomeSpentModal;

import React from 'react';
import { Grid, Button, TextField } from '@mui/material';

import { useFormLists } from './hooks/useFormLists';
import { useFormState } from './hooks/useFormState';
import { createFormHandlers } from './handlers/formHandlers';
import { isFormValid } from './utils/formUtils';
import { defaultInitialValues } from './constants/initialValues';

import PersonSelector from './components/PersonSelector';
import TypeSelector from './components/TypeSelector';
import ItemSelector from './components/ItemSelector';
import AmountInput from './components/AmountInput';
import ConcertedCheckbox from './components/ConcertedCheckbox';
import CustomDatePicker from './components/CustomDatePicker';

const NewIncomeSpentModal = ({ onSubmit, initialValues = defaultInitialValues }) => {
    const lists = useFormLists();
    const [formState, updateFormState] = useFormState(initialValues);
    const { handleSubmit } = createFormHandlers(formState, updateFormState, lists);

    return (
        <form onSubmit={(e) => handleSubmit(e, onSubmit)}>
            <PersonSelector
                value={formState.name}
                onChange={(e) => updateFormState('name', e.target.value)}
                personList={lists.personList}
            />
            <TypeSelector
                value={formState.selectedType}
                onChange={(e) => updateFormState('selectedType', e.target.value)}
            />
            <Grid container>
                <Grid item xs={12}>
                    <ItemSelector
                        value={formState.item}
                        onChange={(e) => updateFormState('item', e.target.value)}
                        items={formState.selectedType === 'ingreso' ? lists.incomeList : lists.spentList}
                        label={formState.selectedType === 'ingreso' ? "Lista de Ingresos" : "Lista de Gastos"}
                        required
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <AmountInput
                        value={formState.amount}
                        onChange={(e) => updateFormState('amount', e.target.value)}
                        required
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <ConcertedCheckbox
                        checked={formState.isConcerted}
                        onChange={(e) => updateFormState('isConcerted', e.target.checked)}
                        disabled={formState.selectedType !== 'gasto'}
                    />
                </Grid>
            </Grid>
            <CustomDatePicker
                value={formState.selectedDate}
                onChange={(newDate) => updateFormState('date', newDate)}
                fullWidth
            />
            <TextField
                id="description"
                name="description"
                fullWidth
                label="Descripción"
                variant="outlined"
                style={{ marginTop: 16 }}
                value={formState.description}
                onChange={(e) => updateFormState('description', e.target.value)}
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: 16 }}
                disabled={!isFormValid(formState)}
                fullWidth
            >
                Añadir {formState.selectedType === 'ingreso' ? 'Ingreso' : 'Gasto'}
            </Button>
        </form>
    );
};

export default NewIncomeSpentModal;
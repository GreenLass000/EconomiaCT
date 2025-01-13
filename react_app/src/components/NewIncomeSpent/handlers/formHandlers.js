import axios from 'axios';
import config from '../../../config';
import { isFormValid, prepareFormData } from '../utils/formUtils';

export const createFormHandlers = (formState, updateFormState, lists) => {
    const handleSpentItemChange = (event) => {
        const selectedSpent = lists.spentList.find(spent => spent.name === event.target.value);
        updateFormState('spentItem', event.target.value);
        if (selectedSpent) {
            updateFormState('isConcerted', selectedSpent.isconcertado === 1);
        }
    };

    const handleSubmit = async (e, onSubmit) => {
        e.preventDefault();
        
        if (!isFormValid(formState)) {
            alert('Por favor complete todos los campos obligatorios.');
            return;
        }

        const formData = prepareFormData(formState, lists.personList);

        console.log('id:', formData.id);

        try {
            await axios.post(`${config.API_URL}/record`, formData);
            onSubmit(formData);
            window.location.reload();
        } catch (error) {
            console.error('Error al añadir el registro:', error);
            alert('Hubo un error al añadir el registro. Por favor, inténtelo de nuevo.');
        }
    };

    return {
        handleSpentItemChange,
        handleSubmit
    };
};

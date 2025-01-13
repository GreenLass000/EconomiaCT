export const isFormValid = (formState) => {
    const { name, selectedType, item, amount } = formState;
    
    if (!name) return false;
    
    if (selectedType === 'ingreso') {
        return !!(item && amount && amount >= 0);
    }
    
    if (selectedType === 'gasto') {
        return !!(item && amount && amount >= 0);
    }

    return false;
};

export const prepareFormData = (formState, personList) => {
    const { 
        selectedType, 
        item,
        amount,
        name,
        selectedDate,
        description,
        isConcerted 
    } = formState;

    const person = personList.find(person => `${person.firstName} ${person.lastName}` === name);

    return {
        person_id: person.id,
        concept: item,
        amount: selectedType === 'ingreso' ? amount : -(amount),
        description,
        date: selectedDate,
        isconcertado: isConcerted
    };
};

import { useEffect } from 'react';

export const useIncomeSpentForm = (formState, updateFormState, lists) => {
    useEffect(() => {
        if (formState.selectedType === 'ingreso') {
            updateFormState('spentItem', '');
            updateFormState('spentAmount', '');
        } else if (formState.selectedType === 'gasto') {
            updateFormState('incomeItem', '');
            updateFormState('incomeAmount', '');
        }
    }, [formState.selectedType, updateFormState]);

    return {
        handleItemChange: (e) => {
            if (formState.selectedType === 'ingreso') {
                updateFormState('incomeItem', e.target.value);
            } else {
                updateFormState('spentItem', e.target.value);
            }
        },
        handleAmountChange: (e) => {
            if (formState.selectedType === 'ingreso') {
                updateFormState('incomeAmount', e.target.value);
            } else {
                updateFormState('spentAmount', e.target.value);
            }
        },
    };
};

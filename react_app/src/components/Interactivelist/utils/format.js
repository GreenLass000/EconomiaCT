export const formatAmount = (amount) => {
	return new Intl.NumberFormat('es-ES', {
	  style: 'currency',
	  currency: 'EUR',
	}).format(amount);
  };
  
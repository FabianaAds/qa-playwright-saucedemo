export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export const validCheckoutInfo: CheckoutInfo = {
  firstName: 'Maria',
  lastName: 'Silva',
  postalCode: '01310-100',
};

/** Massa para cenários negativos: cada linha omite um campo obrigatório. */
export const invalidCheckoutInfo: { caso: string; data: CheckoutInfo; erro: string }[] = [
  {
    caso: 'sem nome',
    data: { ...validCheckoutInfo, firstName: '' },
    erro: 'Error: First Name is required',
  },
  {
    caso: 'sem sobrenome',
    data: { ...validCheckoutInfo, lastName: '' },
    erro: 'Error: Last Name is required',
  },
  {
    caso: 'sem CEP',
    data: { ...validCheckoutInfo, postalCode: '' },
    erro: 'Error: Postal Code is required',
  },
];

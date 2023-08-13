interface Rota {
  rota: RotaDescription;
  assigned: string;
  users: string[];
};

interface RotaDescription {
  name: string;
  description?: string;
};

export { Rota, RotaDescription };
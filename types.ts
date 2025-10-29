
export enum ContractType {
  Intermitente = "Intermitente",
  Freelancer = "Freelancer",
}

export enum Position {
  Monitor = "Monitor",
  Recepcionista = "Recepcionista",
  Socorrista = "Socorrista",
  Limpeza = "Limpeza",
}

export interface Submission {
  id: string;
  firstName: string;
  lastName: string;
  contract: ContractType;
  position: Position;
  dates: Date[];
}

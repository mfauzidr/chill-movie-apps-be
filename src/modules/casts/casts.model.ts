export interface ICastBody {
  name: string;
}

export interface ICast extends ICastBody {
  id: number;
  created_at: Date;
  updated_at: Date | null;
}

export interface ICastParams {
  id: string;
}

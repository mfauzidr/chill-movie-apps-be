export interface IProducerBody {
  name: string;
}

export interface IProducer extends IProducerBody {
  id: number;
  created_at: Date;
  updated_at: Date | null;
}

export interface IProducerParams {
  id: string;
}

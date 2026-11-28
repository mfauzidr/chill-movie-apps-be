export type IPaymentStatus = "pending" | "paid" | "expired" | "failed";

export interface IPayment {
  id: number;
  uuid: string;
  order_uuid: string;
  amount: string;
  payment_method: string;
  payment_code: string | null;
  status: IPaymentStatus;
  expired_at: Date | null;
  paid_at: Date | null;
  created_at: Date;
  updated_at: Date | null;
}

export interface IPaymentParams {
  id: string;
  order_uuid: string;
}

export interface IPaymentUpdateBody {
  status: IPaymentStatus;
}

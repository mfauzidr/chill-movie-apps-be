export interface IOrderCreateBody {
  package_uuid: string;
  payment_method: string;
  promo_code?: string | null;
}

export type IOrderStatus = "pending" | "completed" | "cancelled";

export interface IOrderUpdateBody {
  status: IOrderStatus;
}

export interface IOrder {
  id: number;
  uuid: string;
  user_uuid: string;
  package_uuid: string;
  promo_code: string | null;
  package_price: string;
  discount: string;
  admin_fee: string;
  total_amount: string;
  status: IOrderStatus;
  created_at: Date;
  updated_at: Date | null;
}

export interface IOrderParams {
  id: string;
  user_uuid?: string;
}

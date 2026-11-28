import { IGenre } from "../../modules/genres/genres.model";
import { IProducer } from "../../modules/producers/producers.model";
import { IUser } from "../../modules/users/users.model";
import { ICast } from "../../modules/casts/casts.model";
import { IContent } from "../../modules/contents/contents.model";
import { IPackage } from "../../modules/packages/packages.model";
import { IMyList } from "../../modules/my-lists/my-lists.model";
import { IUserPackage } from "../../modules/user-packages/user-packages.model";
import { IOrder } from "../../modules/orders/orders.model";
import { IPayment } from "../../modules/payments/payments.model";

interface IBasicResponse {
  success?: boolean;
  message: string;
  err?: string;
  warning?: string;
}

export interface IUserResponse extends IBasicResponse {
  results?: Omit<IUser,"password">[]
}

export interface IGenreResponse extends IBasicResponse {
  results?: IGenre[]
}

export interface IProducerResponse extends IBasicResponse {
  results?: IProducer[]
}

export interface ICastResponse extends IBasicResponse {
  results?: ICast[]
}

export interface IContentResponse extends IBasicResponse {
  results?: IContent[]
}

export interface IPackageResponse extends IBasicResponse {
  results?: IPackage[]
}

export interface IMyListResponse extends IBasicResponse {
  results?: IMyList[]
}

export interface IUserPackageResponse extends IBasicResponse {
  results?: IUserPackage[]
}

export interface IOrderResponse extends IBasicResponse {
  results?: IOrder[]
}

export interface IPaymentResponse extends IBasicResponse {
  results?: IPayment[]
}

export interface IErrResponse {
  code?: string;
  column?: string;
  detail?: string;
  message?: string;
}

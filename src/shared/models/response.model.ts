import { IGenre } from "../../modules/genres/genres.model";
import { IProducer } from "../../modules/producers/producers.model";
import { IUser } from "../../modules/users/users.model";

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

export interface IErrResponse {
  code?: string;
  column?: string;
  detail?: string;
  message?: string;
}

import { IGenre } from "../../modules/genres/genres.model";
import { IProducer } from "../../modules/producers/producers.model";
import { IUser } from "../../modules/users/users.model";
import { ICast } from "../../modules/casts/casts.model";
import { IContent } from "../../modules/contents/contents.model";
import { IPackage } from "../../modules/packages/packages.model";

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

export interface IErrResponse {
  code?: string;
  column?: string;
  detail?: string;
  message?: string;
}

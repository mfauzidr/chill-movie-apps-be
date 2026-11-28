export interface IPackageBody {
  name: string;
  price: number;
  benefits: string;
  tnc: string;
}

export type IPackageUpdateBody = Partial<IPackageBody>;

export interface IPackage extends Omit<IPackageBody, "price"> {
  id: number;
  uuid: string;
  price: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date | null;
}

export interface IPackageParams {
  id: string;
}

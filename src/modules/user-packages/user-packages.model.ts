export type IUserPackageStatus = "active" | "expired" | "cancelled";

export interface IUserPackageCreateBody {
  package_uuid: string;
  start_date: string;
  end_date: string;
  status: IUserPackageStatus;
}

export interface IUserPackageUpdateBody {
  start_date?: string;
  end_date?: string;
  status?: IUserPackageStatus;
}

export interface IUserPackage {
  id: number;
  user_uuid: string;
  package_uuid: string;
  start_date: Date | string;
  end_date: Date | string;
  status: IUserPackageStatus;
  created_at: Date;
  updated_at: Date | null;
  package: {
    uuid: string;
    name: string;
    price: number;
  };
}

export interface IUserPackageParams {
  id: string;
}

export interface IUserPackageUserParams {
  user_uuid: string;
}

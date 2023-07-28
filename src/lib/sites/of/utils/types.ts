export interface OFDynamicParamsResponse {
  static_param: string;
  start: string;
  end: string;
  checksum_constant: number;
  checksum_indexes: number[];
  app_token: string;
  revision: string;
  is_current: boolean;
  new_balance: number;
}

export interface OFDynamicParams {
  staticParam: string;
  start: string;
  end: string;
  checksumConstant: number;
  checksumIndexes: number[];
  appToken: string;
  revision: string;
  isCurrent: boolean;
  newBalance: number;
  updatedAt: number;
}

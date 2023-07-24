export interface GetOFDynamicParamsQueryParams {
  revision?: string;
}

export type ClientOFDynamicParams = {
  staticParam: string;
  start: string;
  end: string;
  checksumConstant: number;
  checksumIndexes: number[];
  revision: string;
  appToken: string;
};

export interface NotReady {
  isReady: false;
}

export interface Ready<T> {
  isReady: true;
  value: T;
}

export type Data<T> = NotReady | Ready<T>;

export const isReady = <T>(data: Data<T>): data is Ready<T> => {
  return data.isReady;
};

export const isNotReady = <T>(data: Data<T>): data is NotReady => {
  return !data.isReady;
};

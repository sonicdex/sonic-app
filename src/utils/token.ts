export interface BaseToken {
  iat?: number;
  exp?: number;
  [key: string]: any;
}

export const parseToken = <T extends BaseToken>(token: string) => {
  try {
    return JSON.parse(window.atob(token.split('.')[1])) as T;
  } catch {
    return null;
  }
};

export const createBearerToken = (token: string): string => {
  return `Bearer ${token}`;
};

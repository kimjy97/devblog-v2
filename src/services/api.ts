import axios, { AxiosRequestConfig } from "axios";

export const customThrowError = (error: any) => {
  const errorStatus = error?.response?.status || error.status;
  const errorMessage = error?.response?.data?.error || error.message;
  const errObj: any = new Error(error);

  errObj.status = errorStatus;
  errObj.message = errorMessage;

  return errObj;
}

export const blacklistThrowError = (reason: string) => {
  const errorMessage = reason;

  const errObj: any = new Error();
  errObj.status = 403;
  errObj.message = errorMessage;

  return errObj;
}

export const apiGet = async (url: string, conf?: AxiosRequestConfig) => {
  const result = await axios.get(url, {
    ...conf,
  })
    .then((res: any) => {
      if (res.headers.get('x-is-blacklisted') === 'true') {
        throw blacklistThrowError(res.data.reason);
      }
      return res.data;
    })
    .catch(error => {
      throw customThrowError(error);
    });

  return result;
}

export const apiPost = async (url: string, data: any) => {
  const result = await axios.post(url, data)
    .then((res: any) => {
      if (res.headers.get('x-is-blacklisted') === 'true') {
        throw blacklistThrowError(res.data.reason);
      }
      return res.data;
    })
    .catch(error => {
      throw customThrowError(error);
    })

  return result;
}

export const apiPut = async (url: string, data: any) => {
  const result = await axios.put(url, data)
    .then(res => res.data)
    .catch(error => {
      throw customThrowError(error);
    })

  return result;
}

export const apiDelete = async (url: string, data?: any) => {
  let result;

  if (data) {
    result = await axios.delete(url, { data })
      .then(res => res.data)
      .catch(error => customThrowError(error))
  } else {
    result = await axios.delete(url)
      .then(res => res.data)
      .catch(error => {
        throw customThrowError(error);
      })
  }

  return result;
}
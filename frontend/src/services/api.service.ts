import axios, { AxiosInstance } from "axios";
import environment from "../shared/environments/environment";

export class ApiService {
  instance: AxiosInstance;

  controllerPath: string;

  private sourcesList: { [key: string]: any } = {};

  constructor(controllerPath: string) {
    this.controllerPath = controllerPath;
    this.instance = axios.create({
      baseURL: environment.baseUri,
      withCredentials: false,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "XSRF-Token": document
          .querySelector('meta[name="csrf-token"]')
          .getAttribute("content"),
      },
    });
  }

  deleteById(id: number, url?: string) {
    const query = `${this.controllerPath}${url || ""}/delete?id=${id}`;
    return this.instance.delete(query);
  }

  get(url: string, ...opts: any[]): Promise<any> {
    return this.instance.get(`${this.controllerPath}${url}`, ...opts);
  }

  post(url: string, ...opts: any[]): Promise<any> {
    return this.instance.post(`${this.controllerPath}${url}`, ...opts);
  }

  put(url: string, ...opts: any[]): Promise<any> {
    return this.instance.put(`${this.controllerPath}${url}`, ...opts);
  }

  delete(url: string, ...opts: any): Promise<void> {
    return this.instance.delete(`${this.controllerPath}${url}`, ...opts);
  }

  getCancelToken(key: string) {
    const source = axios.CancelToken.source();

    if (this.sourcesList[key]) {
      this.sourcesList[key].cancel();
    }
    this.sourcesList[key] = source;
    return source.token;
  }
}

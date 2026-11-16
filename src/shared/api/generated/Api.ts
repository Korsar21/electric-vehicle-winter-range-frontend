/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface HandlerSwaggerUserAuthRequest {
  /** @example "lr4_creator" */
  name?: string;
  /** @example "123456" */
  password?: string;
}

export interface HandlerSwaggerUserAuthResponse {
  access_token?: string;
  /** @example 3599 */
  expires_in?: number;
  /** @example "lr4_creator" */
  name?: string;
  /** @example "creator" */
  role?: string;
  /** @example "Bearer" */
  token_type?: string;
  /** @example 3 */
  user_id?: number;
}

export interface HandlerSwaggerUserRegisterRequest {
  /** @example "lr4_creator" */
  name?: string;
  /** @example "123456" */
  password?: string;
}

export interface HandlerSwaggerUserResponse {
  /** @example 3 */
  id?: number;
  /** @example "lr4_creator" */
  name?: string;
}

export interface SerializerElectricCarLoadPublishRequest {
  category?: string;
  description?: string;
  power_draw_w?: number;
  priority?: string;
}

export interface SerializerElectricCarLoadResponse {
  category?: string;
  description?: string;
  has_next?: boolean;
  id?: number;
  image_url?: string;
  is_creator?: number;
  is_liked?: number;
  like_count?: number;
  name?: string;
  power_draw_w?: number;
  priority?: string;
  status?: string;
  video_url?: string;
}

export interface SerializerLikeRequest {
  like?: number;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "//localhost:8080/api",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Electric Vehicle Winter Range API
 * @version 1.0
 * @baseUrl //localhost:8080/api
 * @contact
 *
 * REST API for electric vehicle winter loads. LR4: JWT authentication, authorization and Redis blacklist.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  electricCarLoads = {
    /**
     * @description Returns the service/load list. This endpoint is available without authentication.
     *
     * @tags electric-car-loads
     * @name GetElectricCarLoads
     * @summary Get electric car loads
     * @request GET:/electric-car-loads
     */
    getElectricCarLoads: (
      query?: {
        /** Category */
        category?: string;
        /** Maximum power draw in watts */
        maxPowerW?: number;
        /** Electric car load name */
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<SerializerElectricCarLoadResponse[], any>({
        path: `/electric-car-loads`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags electric-car-loads
     * @name CreateElectricCarLoadDraft
     * @summary Create electric car load draft
     * @request POST:/electric-car-loads
     * @secure
     */
    createElectricCarLoadDraft: (
      data: {
        /** Name */
        name: string;
        /**
         * Image
         * @format binary
         */
        image: File;
        /**
         * Video
         * @format binary
         */
        video: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<SerializerElectricCarLoadResponse, any>({
        path: `/electric-car-loads`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the authenticated creator's draft.
     *
     * @tags electric-car-loads
     * @name GetElectricCarLoadDraft
     * @summary Get creator draft
     * @request GET:/electric-car-loads/draft
     * @secure
     */
    getElectricCarLoadDraft: (params: RequestParams = {}) =>
      this.request<SerializerElectricCarLoadResponse, Record<string, any>>({
        path: `/electric-car-loads/draft`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a published feed item. It is available without authentication.
     *
     * @tags electric-car-loads
     * @name GetElectricCarLoadFeed
     * @summary Get feed item
     * @request GET:/electric-car-loads/feed
     */
    getElectricCarLoadFeed: (
      query?: {
        /** Current item id */
        id?: number;
        /** Return next item */
        next?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<SerializerElectricCarLoadResponse, any>({
        path: `/electric-car-loads/feed`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags electric-car-loads
     * @name PublishElectricCarLoad
     * @summary Publish electric car load
     * @request PUT:/electric-car-loads/{id}
     * @secure
     */
    publishElectricCarLoad: (
      id: number,
      body: SerializerElectricCarLoadPublishRequest,
      params: RequestParams = {},
    ) =>
      this.request<SerializerElectricCarLoadResponse, any>({
        path: `/electric-car-loads/${id}`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Deletes the authenticated creator's load.
     *
     * @tags electric-car-loads
     * @name DeleteElectricCarLoad
     * @summary Delete load
     * @request DELETE:/electric-car-loads/{id}
     * @secure
     */
    deleteElectricCarLoad: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/electric-car-loads/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Adds/removes the authenticated creator's like.
     *
     * @tags electric-car-loads
     * @name SetElectricCarLoadLike
     * @summary Like electric car load
     * @request POST:/electric-car-loads/{id}/like
     * @secure
     */
    setElectricCarLoadLike: (
      id: number,
      body: SerializerLikeRequest,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/electric-car-loads/${id}/like`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}

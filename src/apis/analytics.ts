import { deserialize, serialize } from '@sonicdex/sonic-js';
import axios from 'axios';

import { ENV } from '@/config';

export class AnalyticsApi {
  public axios;
  constructor() {
    this.axios = axios.create({
      baseURL: ENV.analyticsHost,
      method: 'post',
      transformRequest: (data) => serialize(data),
      transformResponse: (data) => deserialize(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async request<T = any>(data: AnalyticsApi.GraphqlQuery): Promise<T> {
    return (await this.axios.request({ data: data })).data.data;
  }

  async queryUserLPMetrics( principalId: string, pairId?: string): Promise<AnalyticsApi.PositionMetrics> {
    const response = await this.request<AnalyticsApi.UserLPMetricsQuery>({
      operationName: null,
      query: `
            query {
              user(id: "${principalId}") {
                positionMetrics${pairId ? `(pairId: "${pairId}")` : ''} {
                  impLoss,
                  fees
                }
              }
            }
            `,
      variables: {},
    });
    return response?.user?.positionMetrics;
  }

  
  async queryUserLPMetrics2( principalId: string, pairId?: string): Promise<AnalyticsApi.userLidityFeeMetrics> {
    const response = await this.request<AnalyticsApi.userLidityFeeMetricsQuery>({
      operationName: null,
      query: `
            query {
              user(id: "${principalId}") {
                userLidityFeeMetrics${pairId ? `(pairId: "${pairId}")` : ''} {
                  token0Fee,
                  token1Fee,
                }
              }
            }
            `,
      variables: {},
    });

    var tokens:any = pairId?.split(':')

    var data:any = response?.user?.userLidityFeeMetrics
    data.token0 = tokens[0];
    data.token1 = tokens[1];
    return data ; response?.user?.userLidityFeeMetrics;
  }

}



export namespace AnalyticsApi {
  export interface GraphqlQuery {
    operationName: string | null;
    query: string;
    variables: any;
  }

  export interface PositionMetrics {
    impLoss: string;
    fees: string;
  }


  export interface userLidityFeeMetrics{
    token0Fee:number
    token1Fee:number,
    token0?:string,
    token1?:string
    token0TotalFee?:number,
    token1TotalFee?:number
  }

  export interface UserLPMetricsQuery {
    user: {
      positionMetrics: PositionMetrics;
    };
  }

  export interface userLidityFeeMetricsQuery {
    user: {
      userLidityFeeMetrics: userLidityFeeMetrics;
    };
  }

  
}

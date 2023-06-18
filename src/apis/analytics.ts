import { deserialize, serialize } from '@memecake/sonic-js';
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

  export interface UserLPMetricsQuery {
    user: {
      positionMetrics: PositionMetrics;
    };
  }
}

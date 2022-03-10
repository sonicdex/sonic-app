import { deserialize, serialize } from '@psychedelic/sonic-js';
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

  async queryUserMetrics(
    principalId: string,
    pairId?: string
  ): Promise<AnalyticsApi.ReturnMetrics> {
    const response = await this.request<AnalyticsApi.UserQuery>({
      operationName: null,
      query: `
            query {
                user(id: "${principalId}") {
                    returnMetrics${pairId ? `(pairId: "${pairId}")` : ''} {
                        hodlReturn,
                        hodlReturn,
                        netReturn,
                        sonicReturn,
                        impLoss,
                        fees
                    }
                }
            }
            `,
      variables: {},
    });

    return response.user.returnMetrics;
  }
}

export namespace AnalyticsApi {
  export interface GraphqlQuery {
    operationName: string | null;
    query: string;
    variables: any;
  }

  export interface ReturnMetrics {
    hodlReturn: string;
    netReturn: string;
    sonicReturn: string;
    impLoss: string;
    fees: string;
  }

  export interface UserQuery {
    user: {
      returnMetrics: ReturnMetrics;
    };
  }
}

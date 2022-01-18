import { Actor, HttpAgent } from '@dfinity/agent';
import { IDL } from '@dfinity/candid';
import type { Provider } from '@psychedelic/plug-inpage-provider';

import { ENV } from '@/config';

import { ActorRepository, AppActors } from '.';

export const appActors: Record<string, any> = {};

export class ActorAdapter implements ActorRepository {
  constructor(private provider?: Provider) {}

  async createActor<T extends AppActors>(
    canisterId: string,
    interfaceFactory: IDL.InterfaceFactory
  ): Promise<any> {
    if (appActors[canisterId]) {
      return appActors[canisterId];
    }

    await this.createAgent();

    let actor;

    if (!this.provider) {
      const agent = new HttpAgent({ host: ENV.host });

      actor = Actor.createActor<T>(interfaceFactory, {
        agent,
        canisterId,
      });
    } else {
      actor = await this.provider.createActor<T>({
        canisterId,
        interfaceFactory,
      } as any);
    }

    appActors[canisterId] = actor;

    return actor;
  }

  private async createAgent(): Promise<any> {
    if (this.provider && !this.provider?.agent) {
      await this.provider.createAgent({
        whitelist: Object.values(ENV.canistersPrincipalIDs),
        host: ENV.host,
      });
    }
  }
}

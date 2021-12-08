import type { Provider } from '@psychedelic/plug-inpage-provider';
import { IDL } from '@dfinity/candid';

import { ENV, ERRORS } from '@/config';

import { ActorRepository, AppActors } from '.';

export const appActors: Record<string, any> = {};

export class ActorAdapter implements ActorRepository {
  constructor(private plugProvider?: Provider) {
    if (!plugProvider) {
      throw new Error(ERRORS.PlugNotConnected);
    }
  }

  async createActor<T extends AppActors>(
    canisterId: string,
    interfaceFactory: IDL.InterfaceFactory
  ): Promise<any> {
    if (appActors[canisterId]) {
      return appActors[canisterId];
    }

    await this.createAgent();

    const actor = await this.plugProvider?.createActor<T>({
      canisterId,
      interfaceFactory: interfaceFactory,
    } as any);

    appActors[canisterId] = actor;

    return actor;
  }

  private async createAgent(): Promise<any> {
    if (this.plugProvider && !this.plugProvider?.agent) {
      await this.plugProvider.createAgent({
        whitelist: Object.values(ENV.canisterIds),
        host: ENV.host,
      });
    }
  }
}

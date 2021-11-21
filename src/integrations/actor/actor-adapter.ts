import type { Provider } from '@psychedelic/plug-inpage-provider';
import { IDL } from '@dfinity/candid';

import { ENV, ERRORS } from '@/config';

import { ActorRepository, AppActors } from '.';

export class ActorAdapter implements ActorRepository {
  constructor(private plugProvider?: Provider) {
    if (!plugProvider) {
      throw new Error(ERRORS.PlugNotConnected);
    }
  }

  async createActor<T extends AppActors>(
    canisterId: string,
    interfaceFactory: IDL.InterfaceFactory
  ): Promise<T> {
    await this.createAgent();
    return this.plugProvider.createActor<T>({
      canisterId,
      interfaceFactory,
    } as any);
  }

  private async createAgent(): Promise<any> {
    if (!this.plugProvider.agent) {
      await this.plugProvider.createAgent({
        whitelist: ENV.canisters,
        host: ENV.host,
      });
    }
  }
}

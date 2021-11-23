import { Actor, ActorSubclass, HttpAgent } from '@dfinity/agent';
import { authClient } from './identity';
import { CommonStore } from '@/store/common.store';
import swapDid from '@/utils/declarations/swap.did';
import ledgerIDL from '@/utils/did/ledger.did';
import CommonTokenIdlFactory from '@/utils/declarations/xtc.did';
// import FaucetIDL from "../utils/faucet.did";
// import StakingIDL from "../utils/staking.did";

class Agent {
  private host: string | undefined = process.env.REACT_APP_HOST;
  private isAuthClientReady: boolean = false;

  async getAgent() {
    return new HttpAgent({
      host: this.host,
      identity: await authClient.getIdentity(),
    });
  }
  //no  identity
  async getNoIdentityAgent() {
    return new HttpAgent({ host: process.env.REACT_APP_HOST });
  }
  async createActor(idlFactory: any, canisterId: string | any) {
    const { walletType } = CommonStore.common;
    switch (walletType) {
      case 'II':
        const agent = await this.getAgent();
        return Actor.createActor(idlFactory, {
          agent,
          canisterId,
        });

      case 'plugWallet':
        // @ts-ignore
        return window?.ic?.plug.createActor({
          canisterId: canisterId,
          interfaceFactory: idlFactory,
        });
      default:
        return;
    }
  }

  async noIdentityActor(
    canisterId: string,
    IdlFactory
  ): Promise<ActorSubclass> {
    const agent = await this.getNoIdentityAgent();
    return Actor.createActor(IdlFactory, {
      agent,
      canisterId,
    });
  }

  async swapActor(): Promise<ActorSubclass> {
    return this.createActor(swapDid, process.env.REACT_APP_SWAP_CANISTER_ID);
  }
  async ledgerActor(): Promise<ActorSubclass> {
    return this.createActor(
      ledgerIDL,
      process.env.REACT_APP_LEDGER_CANISTER_ID
    );
  }
  async swapStorageActor(): Promise<ActorSubclass> {
    return this.createActor(
      ledgerIDL,
      process.env.REACT_APP_SWAP_STORAGE_CANISTER_ID
    );
  }
  async commonTokenActor(canisterId: string): Promise<ActorSubclass> {
    // await PlugWallet.updateAgentWhitelist(canisterId);
    return this.createActor(CommonTokenIdlFactory, canisterId);
  }
  async commonNoIdentityActor(canisterId: string) {
    return this.noIdentityActor(canisterId, CommonTokenIdlFactory);
  }
}

export const GetAgent = new Agent();
export const AuthClient = authClient;

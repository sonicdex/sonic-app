//const {fetch} = require('node-fetch');
global.fetch = require('node-fetch');

const { Actor, HttpAgent, SignIdentity, AnonymousIdentity } = require('@dfinity/agent');
const SUPPORTED_IDLS = require('./constants');
const HOST = "https://icp0.io/"

module.exports = {
  getAnonActor: async function (canisterId, idlIndex) {
    var IDL = SUPPORTED_IDLS[idlIndex];
    const agent = new HttpAgent({ host: HOST, AnonymousIdentity });
    const actor = await Actor.createActor(IDL, { agent: agent, canisterId: canisterId });
    return actor;
  },
};
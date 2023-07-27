const { getAnonActor } = require('./did/chain-utils');
const fs = require("fs");
const basePath = process.cwd();
const buildDir = `${basePath}/out/`;
const utils = require('./did/identifier-utils')
var axios = require('axios');

const asyncForEach = async function asyncForEach(a, c) { for (let i = 0; i < a.length; i++) { await c(i, a) } };
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
const done = function () { };
const times = x => f => { if (x > 0) { f(); times(x - 1)(f) } }
const getRandomInt = function (max) { return Math.floor(Math.random() * max) }
const copyFile = function (f, d) { return new Promise((resolve, reject) => { fs.copyFile(f, d, (err) => { if (err) resolve(false); resolve(true); }); }) }
const saveFile = function (f, d) { return new Promise((resolve, reject) => { fs.writeFile(f, d, 'utf8', (err) => { resolve(false); resolve(true); }); }) }

const toHexString = (byteArray) => {
    return Array.from(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}
const fromHexString = (hex) => {
    if (!hex) return [];
    if (hex.substr(0, 2) === "0x") hex = hex.substr(2);
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

const BaseToken= 'ryjl3-tyaaa-aaaaa-aaaba-cai';
const MainToken='bf7ec-maaaa-aaaag-qcgda-cai';

const LBPCID='gpvvq-rqaaa-aaaah-admna-cai';


const runFn = async function (){
    const swapactor = await getAnonActor(LBPCID, 'SONICSWAPCANDID');
    
}
runFn().then(() => { console.log('\n\nTask Completed...'); });

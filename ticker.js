const AWS = require("aws-sdk") , path = require("path"), fs = require('fs'), util = require('util'), mime = require('mime-types'), glob = require("glob");
var axios = require('axios');

let dotenv = require('dotenv').config();
projectRoot = path.join(__dirname);

var awsconfig = {
    awsAccessKeyId:process.env.awsAccessKeyId,
    secretAccessKey:process.env.secretAccessKey,
    awsRegion: process.env.awsRegion
}
var bucket="mcdatapool";
var objPath = 'ticker/icpusdt'
var updateInterval = 30*1000
const saveFile = function(f ,d){ return new Promise((resolve,reject)=>{ fs.writeFile(f, d, 'utf8', (err)=>{ resolve(false); resolve(f); });})}
var readFile = util.promisify(fs.readFile);
var deleteFile= async function(f){ return new Promise((resolve,reject)=>{ fs.unlink(f,function(err){ if(err) resolve(false); resolve(true) })})}

setInterval(() => {
    console.log('updateing');
    var config = { method: 'get', maxBodyLength: Infinity, url: 'https://api.binance.com/api/v3/avgPrice?symbol=ICPUSDT',
        headers: { }
    };
    var s3 = new AWS.S3({ accessKeyId: awsconfig.awsAccessKeyId, secretAccessKey: awsconfig.secretAccessKey });
    axios(config).then(async function (response) {
        var temp = await saveFile(projectRoot+'/icpusdt.json' , JSON.stringify(response.data) )
       // var temp = await s3.deleteObject({ Bucket: bucket , Key:'ticker/icpusdt'}).promise();

        console.log(temp);

        var fileContent =  await readFile(projectRoot+'/icpusdt.json').catch(err=>{ console.log('error on read ('+index+')'+item)});
        
        var params = { Bucket:bucket , Key: objPath, Body: fileContent , ContentType:'application/json'};
        var s = await s3.putObject(params).promise();
       // await deleteFile(projectRoot+'/icpusdt.json');
        console.log(response.data);

    }).catch(function (error) { console.log(error);});

},updateInterval);
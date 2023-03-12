const AWS = require("aws-sdk") , path = require("path"), fs = require('fs'), util = require('util'), mime = require('mime-types'), glob = require("glob");

let dotenv = require('dotenv').config();

projectRoot = path.join(__dirname);

var awsconfig = {
    awsAccessKeyId:process.env.awsAccessKeyId,
    secretAccessKey:process.env.secretAccessKey,
    awsRegion: process.env.awsRegion
}
var buckets={
    prod:'app.sonic.ooo',
    dev:'test-net.sonic.ooo'
}
var asyncForEach =  async function asyncForEach(array, callback) { for (let index = 0; index < array.length; index++) { await callback(array[index], index, array) } };
var readFile = util.promisify(fs.readFile);

const uploadTos3 = async function(buildType = 'dev') {
    if(!buildType) return 0;
    var s3 = new AWS.S3({ accessKeyId: awsconfig.awsAccessKeyId, secretAccessKey: awsconfig.secretAccessKey });
    var fileList = await getDirectyFiles('dist');
    if(!fileList.length) console.log('DIst folder empty..')
    else{
        console.log('Deployment ('+buildType+') Started...');
        var params = { Bucket: buckets[buildType], Delimiter: '/',};
        await s3.listObjectsV2(params).promise().then(async ({ Contents }) => {
            if (Contents.length)
            await s3.deleteObjects({ Bucket: buckets[buildType], Delete: { Objects: Contents.map((item) => ({ Key: item.Key }))}}).promise();
            await s3.listObjectsV2({ Bucket: buckets[buildType], Delimiter: '/static',}).promise().then(async ({ Contents }) => {
                if (Contents.length)
                await s3.deleteObjects({ Bucket: buckets[buildType], Delete: { Objects: Contents.map((item) => ({ Key: item.Key }))}}).promise();
            })
        })
        console.log('cleaned up bucket');
        console.log('Upload Started...');
        await asyncForEach(fileList, async function(item, index){
           var fileContent =  await readFile(projectRoot+'/dist/'+item).catch(err=>{ console.log('error on read '+item)});
           if(fileContent){
            var mimeType = mime.lookup(projectRoot+'/dist/'+item);
            var params = { Bucket:buckets[buildType] , Key: item, Body: fileContent , ContentType:mimeType};
            var s = await s3.putObject(params).promise();
           }
        })
        console.log('Upload complete...');
        console.log('Deployed '+buildType)
    }
}

var getDirectyFiles =async function (src) {
    return new Promise((resolve, reject) => {
        glob(src + '/**/*', function(err, res){
            res.forEach((el,i) => {res[i] = res[i].replace(src+'/','')});
            resolve(res) ;
        });
    })
};
uploadTos3(process.argv[2]);
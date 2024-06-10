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
    preprod:'test-net.sonic.ooo',
    dev:'dev.sonic.ooo'
}
var distributions={
    prod:'E32OS6OHYP8CJU',
    preprod:'E3ABAAMEF9JRLC',
    dev:"E3SAHCRX5HU64G"
}

var asyncForEach =  async function asyncForEach(array, callback) { for (let index = 0; index < array.length; index++) { await callback(array[index], index, array) } };
var readFile = util.promisify(fs.readFile);
var deleteFile= async function(f){ return new Promise((resolve,reject)=>{ fs.unlink(f,function(err){ if(err) resolve(false); resolve(true) })})}
const uploadTos3 = async function(buildType = 'dev') {

    console.log( buckets[buildType]);
    

    if(!buildType) return 0;
    var s3 = new AWS.S3({ accessKeyId: awsconfig.awsAccessKeyId, secretAccessKey: awsconfig.secretAccessKey , });
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
        console.log('Upload Started...',);
        await asyncForEach(fileList, async function(item, index){
           var fileContent =  await readFile(projectRoot+'/dist/'+item).catch(err=>{ console.log('error on read ('+index+')'+item)});
           if(fileContent){
            var mimeType = mime.lookup(projectRoot+'/dist/'+item);
            var params = { Bucket:buckets[buildType] , Key: item, Body: fileContent , ContentType:mimeType};
            var s = await s3.putObject(params).promise();
            console.log( 'completed '+index+' of '+fileList.length );
           }
        })
        console.log('Upload complete...');
        console.log('Deployed '+buildType);
        console.log('Running Invalidations');

        var items = [ '/*' ]
        var cloudfront = new AWS.CloudFront({ accessKeyId: awsconfig.awsAccessKeyId, secretAccessKey: awsconfig.secretAccessKey })
    
        var params = {
            DistributionId: distributions[buildType],
            InvalidationBatch: {
                CallerReference: new Date().getTime().toString(), /* required */
                Paths: { Quantity: 1,Items: items }
            }
        };
        var s=  await cloudfront.createInvalidation(params).promise();
        console.log('Invalidations complete...');
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



console.log(process.argv[2])

uploadTos3(process.argv[2]);
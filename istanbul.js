var Nightmare=require('nightmare');
var cheerio=require('cheerio');
var mysql = require('mysql');
var Client = require('ftp');
require('nightmare-load-filter')(Nightmare);
var fs = require('fs');
var Xvfb = require("xvfb");
var xvfb = new Xvfb({
    silent: true
});

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
var db = null;
var host = null;
var isWorkingOnServer = false;
var isFTPUpload = false;
var isJsonFile = false;
var isWritableToDB = false;
var list = [];
var ilceHrefList=[];

if(dd<10) {
    dd = '0'+dd
}
if(mm<10) {
    mm = '0'+mm
}

today =  yyyy + '.' + mm + '.' + dd;


if (fs.existsSync('db.json')) {
    db = JSON.parse(fs.readFileSync('db.json', 'utf8'));
}

if (fs.existsSync('host.json')) {
    host = JSON.parse(fs.readFileSync('host.json','utf8'));
}

var args = process.argv.splice(process.execArgv.length + 2);
console.log(args);

if (args.includes("srv")){
    isWorkingOnServer = true;
}
if (args.includes("ftp")){
    isFTPUpload = true;
}
if (args.includes("json")){
    isJsonFile = true;
}
if (args.includes("db")){
    isWritableToDB = true;
}

if(isWorkingOnServer){
    xvfb.startSync();
}


let nightmare = Nightmare({show:false});
nightmare.goto('http://apps.istanbulsaglik.gov.tr/Eczane')
    .wait('#ilceler')
    .evaluate(function(){
        return document.body.innerHTML;
    })
    .end(function(body){
        var $= cheerio.load(body);
        $('#ilce').each(function(i,element){
            if(typeof($(this).attr('href'))!== "undefined")
            {
                ilceHrefList.push($(this).attr('href'));
            }
        });

    }).then(function(){

    getNobetciEczaneRecursive(ilceHrefList);

});

function getNobetciEczaneRecursive(ilce_list)
{
    ilce = ilce_list[0].replace('#','');
    ilce = ilce.trim();

    if(typeof(ilce_list[0]) !== 'undefined')
        var nightmare = Nightmare({show:false});
    nightmare
        .filter({
            urls: [ 'http://apps.istanbulsaglik.gov.tr/Eczane/scripts/bootstrap.min.js',
                'http://apps.istanbulsaglik.gov.tr/Eczane/scripts/modernizr-2.8.3.js',
                'http://apps.istanbulsaglik.gov.tr/Eczane/Content/Site.css',
                'http://apps.istanbulsaglik.gov.tr/Eczane/Content/bootstrap.css',
                'http://apps.istanbulsaglik.gov.tr/Eczane/Content/bootstrap.min.css',
            'http://apps.istanbulsaglik.gov.tr/Eczane/Content/dist/css/bootstrap.css',
            'http://apps.istanbulsaglik.gov.tr/Eczane/Content/less/*.less',
            'https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css',
            'https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/fonts/fontawesome-webfont.woff2?v=4.5.0']
        }, function(details, cb) {
            return cb({ cancel: true });
        })
        .goto('http://apps.istanbulsaglik.gov.tr/Eczane')
        .click('a[href$="'+ilce+'"]')
        .wait(1000)
        .evaluate(function(){
            return document.body.innerHTML;
        })
        .end(function(body){
            var $= cheerio.load(body);
            $('#ilce-nobet-detay > tbody > tr > td').each(function(i,elem){
                for(var x=0; x<$(this).find('thead > tr > td > div').length; x++) {
                    var str = $(this).find('thead > tr > td > div')[x]["attribs"]["title"].split(" ");
                    var ilce = str[0];
                    var name = $(this).find('thead > tr > td > div')[x]["attribs"]["title"].replace(ilce,"").trim();
                    var il = "İstanbul";
                    var tarih = today;
                    var string = $(this).find('table > tbody > tr:nth-child(5) > td > span > a')[x]["attribs"]["href"]
                        .replace('http://sehirharitasi.ibb.gov.tr/?lat=', '')
                        .replace('&', ',')
                        .replace('lon=', '')
                        .replace('&zoom=18', '').split(",");

                    var lat = string[0];
                    var long = string[1];
                    var adres = $(this).find('#adres > td:nth-child(2) > label')[x]["children"][0]["data"];

                    var tel = $(this).find('#Tel > td:nth-child(2) > label > a')[x]["children"][0]["data"];

                    list.push({"il":il,"ilce":ilce,"tarih":tarih,"eczane":name,"lat":lat,"long":long,
                        "adres":adres,"tel":tel});

                }
            });

        }).then(function(){
        ilce_list.splice(0,1);
        if(ilce_list.length !== 0) {
            getNobetciEczaneRecursive(ilce_list);
        }else {
            if(isWritableToDB){
                writeResultsToDb();
            }
            if(isJsonFile){
                writeJsonFile();
            }
            if(isWorkingOnServer){
                xvfb.stopSync();
            }
            if(isFTPUpload){
                uploadToFTP();
            }
            if(!isFTPUpload && !isJsonFile && !isWritableToDB){
                console.log(list);
            }
        }
    });
}

function uploadToFTP() {
    fs.writeFile ("istanbul-temp.json", JSON.stringify(list), function(err) {
            if (err) throw err;
            console.log('complete');
        }
    );
    var c = new Client();
    c.on('ready', function() {
        c.put('istanbul-temp.json', '/istanbul_' + today + '.json', function(err) {
            if (err) throw err;
            c.end();
            fs.unlinkSync('istanbul-temp.json');
        });
    });
    c.connect({host: host.host, port: host.port, user: host.user, password: host.password});
}


function writeJsonFile() {
    fs.writeFile ("istanbul_" + today + ".json", JSON.stringify(list), function(err) {
            if (err) throw err;
            console.log('complete');
        }
    );
}


function writeResultsToDb()
{
    var con = mysql.createConnection({
        host: db.host,
        user: db.user,
        password: db.password,
        database: db.database,
        debug: db.debug
    });
    for(var i = 0; i < list.length; i++) {
        con.query("Insert Into eczane(town,name,city,date,address,phone,latitude,longitude) Values(?,?,?,?,?,?,?,?)"
            ,list[i]["ilce"],list[i]["eczane"],list[i]["il"],list[i]["tarih"],list[i]["adres"],list[i]["tel"],list[i]["lat"],list[i]["long"],
            function (err, result) {
            if (err) {
                throw err;
            }
        });
    }
    con.end();
}


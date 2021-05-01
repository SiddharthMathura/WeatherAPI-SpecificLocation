require("dotenv").config();
const fs = require('fs');
const http = require('http');
var requests = require("requests");

const homefile = fs.readFileSync("home.html","utf-8");

const replaceval = (tempval, orgval) => {
        let tempreature = tempval.replace("{%tempval%}", orgval.main.temp);
        tempreature = tempreature.replace("{%tempmin%}", orgval.main.temp_min);
        tempreature = tempreature.replace("{%tempmax%}", orgval.main.temp_max);
        tempreature = tempreature.replace("{%location%}", orgval.name);
        tempreature = tempreature.replace("{%country%}", orgval.sys.country);
        tempreature = tempreature.replace("{%tempstatus%}", orgval.weather[0].main);
        return tempreature;
}; 

const server = http.createServer((req,res) => {
        if(req.url == "/"){
            requests(process.env.SITE)
                .on("data", (chunk) => {
                    const objdata = JSON.parse(chunk);
                    const arraydata = [objdata]; 
                   // console.log(arraydata[0].main.temp);
                   const realtimedata = arraydata.map((val) =>  replaceval(homefile,val))
                        .join("");
                   res.write(realtimedata)
                   //console.log(realtimedata);
                })
                .on("end", (err) => {
                    if(err) return console.log("connection closed due to error.",err);
                    console.log("end");
                });
        }else {
            res.end("File unavailable.")
        }
});

server.listen(3000,"127.0.0.1");
console.log("server connected.");
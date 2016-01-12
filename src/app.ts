/// <reference path="../typings/tsd.d.ts" />

import * as hapi from "hapi";
import Controllers from "./controllers";
import * as fs from "fs";
import * as mkdirp from "mkdirp";

var port = process.env.port || 3000;
var server = new hapi.Server();

server.connection({ port: port });


//Register Controllers
Controllers(server);

server.start(function () {
    console.log('Server running at:', server.info.uri);
});


mkdirp('tmp/some/path/foo', function(err) {

  // path was created unless there was error
  fs.writeFile('tmp/some/path/foo/ddd.txt', 'Hello Node.js', (err) => {
    if (err) throw err;
    console.log('It\'s saved!');
  });
});




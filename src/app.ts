/// <reference path="../typings/tsd.d.ts" />

import * as hapi from "hapi";
import Controllers from "./controllers";
import * as fs from "fs";
import * as fsp from "fs-promise";
import * as mkdirp from "mkdirp";
import * as nunjucks from "nunjucks";


var port = process.env.port || 3000;
var server = new hapi.Server();

server.connection({ port: port });


//Register Controllers
Controllers(server);

server.start(function () {
  console.log('Server running at:', server.info.uri);
});


//http://stackoverflow.com/questions/10049557/reading-all-files-in-a-directory-store-them-in-objects-and-send-the-object
const htmlData = {
  title : 'My First Nunjucks Page',
  items : [
    { name : 'item #1' },
    { name : 'item #2' },
    { name : 'item #3' },
    { name : 'item #4' },
  ]
}

const html =
`<!doctype html>
<html>
  <head>
  <title>welcome to {{ title }}</title>
  </head>
  <body>
    <ul>
    {% for item in items %}
      <li>{{ item.name }}</li>
    {% endfor %}
    </ul>
  </body>
</html>`;

var template = nunjucks.compile(html);
const rendered = template.render(htmlData);


fsp.writeFile('hello1.txt', 'hello world')
  .then(() => {
    return fsp.readFile('hello1.txt', {encoding:'utf8'});
  })
  .then((contents) => {
    console.log("contentss", contents);
  });

mkdirp('tmp/some/path/foo', function(err) {
  // path was created unless there was error
  fs.writeFile('tmp/some/path/foo/ddd.html', rendered, (err) => {
    if (err) {
      throw err;
    }


    console.log('It\'s saved!');
  });
});




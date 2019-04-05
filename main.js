let ArgumentParser = require('argparse').ArgumentParser;
let request = require('request');
let cheerio = require('cheerio');
let chalk = require('chalk');
let path = require('path');
let url = require('url');
let fs = require('fs');

let parser = new ArgumentParser({
    addHelp: true
});

parser.addArgument(
    ["url"],
    {
        help: "URL to pull images from"
    }
);
parser.addArgument(
    ["-d", "--destination"],
    {
        help: "folder to save the images to (default is '.')"
    }
);

let args = parser.parseArgs();

request({
    uri: args.url,
}, function(error, response, body) {
    let $ = cheerio.load(body);

    let imgs = $('img');

    imgs.each(function() {
        let img = $(this);
        let imgSrc = img.attr('src');
        let imgPath = url.resolve(args.url, imgSrc);
        let splitPath = imgPath.split('/');
        let filePath = path.join((args.destination || './'), splitPath[splitPath.length - 1]);

        console.log(imgPath, filePath);

        download(imgPath, filePath);
    });
});


let download = (uri, filePath) => {
    request(uri).pipe(fs.createWriteStream(filePath));
};

console.log(args);
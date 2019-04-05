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
        help: "URL to grab images from"
    }
);
parser.addArgument(
    ["-d", "--destination"],
    {
        help: "folder to save the images to (default is '.')"
    }
);
parser.addArgument(
    ["-t",  "--test"],
    {
        help: "find images without downloading them",
        action: 'storeTrue'
    }
);

let args = parser.parseArgs();

const defaultPath = "./";

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
        let destination = args.destination || defaultPath;
        let filePath = path.join(destination, splitPath[splitPath.length - 1]);

        console.log(imgPath, filePath);

        if (!args.test) {
            download(imgPath, filePath);
        }
    });

    console.log(chalk.green('Finished!'));
});


let download = (uri, filePath) => {
    request(uri).pipe(fs.createWriteStream(filePath));
};

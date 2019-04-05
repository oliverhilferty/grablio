let ArgumentParser = require('argparse').ArgumentParser;
let request = require('request');
let cheerio = require('cheerio');
let chalk = require('chalk');
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

console.log(args);
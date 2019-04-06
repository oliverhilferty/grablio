const ArgumentParser = require('argparse').ArgumentParser;
const readlineSync = require('readline-sync');
const request = require('request');
const cheerio = require('cheerio');
const chalk = require('chalk');
const path = require('path');
const url = require('url');
const fs = require('fs');

let parser = new ArgumentParser({
    addHelp: true
});

const defaultPath = "./";

parser.addArgument(
    ["url"],
    {
        help: "URL to grab images from"
    }
);
parser.addArgument(
    ["-d", "--destination"],
    {
        help: `folder to save the images to (default is '${defaultPath}')`
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

const destination = args.destination || defaultPath;

if (!fs.existsSync(destination)) {
    confirmCreatePrompt = `${chalk.red(`Directory '${destination}' does not exist. Do you want to create it?`)}\n> `;
    let confirmCreate = readlineSync.question(confirmCreatePrompt);
    let regexYes= /^(yes)$|^y$/i;
    if (regexYes.test(confirmCreate)) {
        try {
            fs.mkdirSync(destination, {
                recursive: true
            });
        } catch (e) {
            if (e.code === "ENOENT") {
                console.log(chalk.red("Couldn't create directory. You may need to update your version of node.js"));
                process.exit();
            } else {
                throw e;
            }
        }
    } else {
        process.exit();
    }
}

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

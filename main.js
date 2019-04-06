const ArgumentParser = require('argparse').ArgumentParser;
const readlineSync = require('readline-sync');
const request = require('request');
const cheerio = require('cheerio');
const chalk = require('chalk');
const path = require('path');
const url = require('url');
const fs = require('fs');

const defaults = {
    destination: "./",
    element: "img",
    attr: "src"
};

/**
 * Acts like Object.assign, but will not overwrite values in target with falsey values from source or mutate target
 * or source objects
 * @param target {Object}
 * @param source {Object}
 * @returns {Object}
 */
const argMerge = (target, source) => {
    // source value overwrites target value but only if source value is truthy
    let out = target;
    for (let property in source) {
        if (source.hasOwnProperty(property)) {
            if (source[property]) {
                out[property] = source[property];
            }
        }
    }
    return out;
};

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
        help: `folder to save the images to (default is '${defaults.destination}')`
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
args = argMerge(defaults, args);

if (!fs.existsSync(args.destination)) {
    confirmCreatePrompt = `${chalk.red(`Directory '${args.destination}' does not exist. Do you want to create it?`)}\n> `;
    let confirmCreate = readlineSync.question(confirmCreatePrompt);
    let regexYes= /^(yes)$|^y$/i;
    if (regexYes.test(confirmCreate)) {
        try {
            fs.mkdirSync(args.destination, {
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

    let imgs = $("img");

    imgs.each(function() {
        let img = $(this);
        let imgSrc = img.attr("src");
        let imgPath = url.resolve(args.url, imgSrc);
        let splitPath = imgPath.split("/");
        let filePath = path.join(args.destination, splitPath[splitPath.length - 1]);

        console.log(imgPath, filePath);

        if (!args.test) {
            download(imgPath, filePath);
        }
    });

    console.log(chalk.green("Finished!"));
});

let download = (uri, filePath) => {
    request(uri).pipe(fs.createWriteStream(filePath));
};

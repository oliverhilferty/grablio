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
    selector: "img",
    attr: "src"
};

/**
 * downloads a file from a given uri to a given file path
 * @param uri {String}
 * @param filePath {String}
 */
let download = (uri, filePath) => {
    request(uri).pipe(fs.createWriteStream(filePath));
};

/**
 * Acts like Object.assign, but will not overwrite values in target with falsey values from source or mutate target
 * or source objects
 * @param target {Object}
 * @param source {Object}
 * @returns {Object}
 */
const argMerge = (target, source) => {
    let out = target;
    for (let property in source) {
        if (source.hasOwnProperty(property)) {
            // source value overwrites target value but only if source value is truthy
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
    ["-s", "--selector"],
    {
        help: `CSS selector to get from the page (default is ${defaults.selector})`
    }
);
parser.addArgument(
    ["-a", "--attr"],
    {
        help: `the attribute to get from the selected elements (default is ${defaults.attr})`
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

    let els = $(args.selector);

    els.each(function() {
        let el = $(this);
        let imgLocation = el.attr(args.attr);
        let imgPath = url.resolve(args.url, imgLocation);
        let splitPath = imgPath.split("/");
        let fileName = splitPath[splitPath.length - 1];
        let filePath = path.join(args.destination, fileName);

        console.log(imgPath, filePath);

        if (!args.test) {
            download(imgPath, filePath);
        }
    });

    console.log(chalk.green("Finished!"));
});

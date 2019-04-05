let ArgumentParser = require('argparse').ArgumentParser;

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
        help: "folder to save the images to"
    }
);

let args = parser.parseArgs();

console.log(args);
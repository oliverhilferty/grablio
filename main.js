let ArgumentParser = require('argparse').ArgumentParser;

let parser = new ArgumentParser({
    addHelp: true
});

parser.addArgument(
    ["--url"],
    {
        help: "URL to pull images from"
    }
);

let args = parser.parseArgs();
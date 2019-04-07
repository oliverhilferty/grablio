# grablio
A command line tool for grabbing images from a URL

## Usage
```$xslt
usage: main.js [-h] [-d DESTINATION] [-s SELECTOR] [-a ATTR] [-t] url

Positional arguments:
  url                   URL to grab images from

Optional arguments:
  -h, --help            Show this help message and exit.
  -d DESTINATION, --destination DESTINATION
                        folder to save the images to (default is './')
  -s SELECTOR, --selector SELECTOR
                        CSS selector to get from the page (default is img)
  -a ATTR, --attr ATTR  the attribute to get from the selected elements
                        (default is src)
  -t, --test            find images without downloading them
```
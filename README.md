# grablio
A command line tool for grabbing images from a URL

## Set-up
### User
1) Install node: https://nodejs.org/en/
2) `npm -install -g grablio`
 
### Dev
1) Install node: https://nodejs.org/en/
2) `git clone https://github.com/oliverhilferty/grablio.git`
3) `cd grablio`
4) `npm install`

## Usage
```$xslt
usage: grablio [-h] [-d DESTINATION] [-s SELECTOR] [-a ATTR] [-t] url

Positional arguments:
  url                   URL to grab images from

Optional arguments:
  -h, --help            Show this help message and exit.
  -d DESTINATION, --destination DESTINATION
                        folder to save the images to (default is './')
  -s SELECTOR, --selector SELECTOR
                        CSS selector to get from the page (default is 'img')
  -a ATTR, --attr ATTR  the attribute to get from the selected elements
                        (default is 'src')
  -t, --test            find images without downloading them
```
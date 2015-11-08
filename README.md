# customer-import

[![Build Status][travis-customer-import-badge]][travis-customer-import]

This is just an example of how I would create a CLI utility to import
[customers](http://dev.sphere.io/http-api-projects-customers.html) from a
stream of JSON documents representing customers.

## Install

```bash
npm install -g lpinca/customer-import
```

## Usage

```
$ customer-import [options] [<path>]

Options
  -c, --concurrency How many customers should be imported in parallel (20)
  -p, --path        The path used to match the customers (customers.*)

Examples
  $ customer-import customers.json
  $ customer-import < customers.json
  $ cat customers.json | customer-import
```

## TODO

- [ ] Better error handling

## License

[MIT](LICENSE)

[travis-customer-import-badge]: https://img.shields.io/travis/lpinca/customer-import/master.svg
[travis-customer-import]: https://travis-ci.org/lpinca/customer-import

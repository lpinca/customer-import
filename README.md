# customer-import

This is just an example of how I would create a CLI utility to import
[customers](http://dev.sphere.io/http-api-projects-customers.html) from a
stream of JSON documents representing customers.

## Install

```bash
npm install -g lpinca/customer-import
```

## Usage

```bash
customer-import [<file>]
```

## Examples

```bash
customer-import customers.json
customer-import < customers.json
cat customers.json | customer-import
```

## License

[MIT](LICENSE)

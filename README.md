# customer-import

This is just an example of how I would create a CLI utility to import
[customers](http://dev.sphere.io/http-api-projects-customers.html) from a
stream of JSON documents representing customers.

## Install

```bash
npm install -g lpinca/customer-import
```

## Usage

```
customer-import [options] [<path>]
```

### Options

```
-c, --concurrency How many customers should be imported in parallel (20)
-p, --path        The path used to match the customers (customers.*)
```

### Examples

```bash
customer-import customers.json
customer-import < customers.json
cat customers.json | customer-import
```

## TODO

- [ ] Better error handling
- [ ] Tests

## License

[MIT](LICENSE)

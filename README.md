<!-- HTML align attr & gnarly nesting required to override Github's styles -->
<div align="center">
  <img src="logo.png" alt="logo" width="200">

  <h1>
    Fast Webhook
    <p>
      <img src="https://flat.badgen.net/badge/Github/Action/green?icon=github" alt="Github Action">
      <img src="https://flat.badgen.net/badge/License/MIT/green" alt="MIT license">
    </p>
  </h1>
</div>

A simple, fast-compiling, JavaScript Github Action to send a POST request with a
JSON body to a URL.

It builds very quickly (<1s) relative to Docker-based actions, which take ~30s,
reducing build times.

## Inputs

### `url`

**Required**

The url to send the request to.

### `json`

**Optional**

A JSON string to be sent as the POST body (e.g. `'{"foo":"bar"}'`).

If this is not provided, or if the value is an empty string, an empty JSON body
will be sent (i.e. `'{}'`).

## Outputs

None.

## Example usage

```yaml
uses: jasongitmail/fast-webhook@v1
with:
  url: ${{ secrets.WEBHOOK_URL }}
  json: '{"foo": "bar"}'
```

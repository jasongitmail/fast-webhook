# fast-webhook

`fast-webhook` is a simple, fast-compiling Javascript Github Action to send a POST request with a JSON body to a URL.

It compiles very quickly relative to Docker-based webhooks, which take ~30s, reducing build times.

## Inputs

### `url`

**Required**

The url to send the request to.

### `json`

**Optional**

The already-stringified json to be sent as the POST body (e.g. `'{"foo":"bar"}'`). Must be provided already stringified because it's not possible pass a JS object via YAML.

If this is not provided, or the value is an empty string, an empty JSON body will be sent (e.g. `'{}'`).

## Outputs

None.

## Example usage

```yaml
uses: jasongitmail/fast-webhook@master
with:
  url: ${{ secrets.WEBHOOK_URL }}
  json: '{"foo": "bar"}'
```

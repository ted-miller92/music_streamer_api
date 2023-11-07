# Music Streamer API

## How to send requests

For any request body, use x-www-form-urlencoded. Request parameters and body attributes should follow camelCase syntax for variable names. For example, a Post request with a body to create a new artist should look like this:

```
body : {
    artistName: `${artistName}`,
    artistDescription: `${artistDescription}`
}
```


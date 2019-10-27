Quick Address Service
=====================

* Listens to port 8080
* Proxies requests to QAS
* Adds CORS headers to response
* Fetches and refreshes JWT

Getting started
---------------

```
$ git clone https://github.service.anz/hoeksj/quick-address-service/
$ cd quick-address-service
$ npm install
$ npm start
```

Configuration
-------------

Configuration is through environment variables. You can add a `.env` file in
this directory (ignored by git) or set them via command line or `rc` file.

These host variables must start with `http://` or `https://` and end with `/`.

[See the wiki for more information.][env-vars]

### `ADDRESS_HOST`

Electronic verification host. Address requests will be proxied to this domain.

### `AUTH_HOST`

Authentication host. Must be in the same environment as the address host.


[env-vars]: https://github.service.anz/hoeksj/quick-address-service/wiki/Environment-variables

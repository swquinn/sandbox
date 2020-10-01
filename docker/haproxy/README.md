haproxy
========

This directory contains the Docker configuration for running an HA proxy that
fronts the sandbox server examples. The goal of this is to show the load
balancing layer.

This container, when running, will run on ports 80 and 443 for `http` and
`https` traffic.  It will reroute requests to specific top-level paths to
desired ports as specified in the `haproxy.cfg` file.  Downstream servers,
such as NGINX, should run on a different port.

To see a health status of all  downstream servers, visit:

```
app-dev.sandbox.com:1234
```

The status of each server is determined by HAProxy by doing its own health
checks. To allow haproxy to do healthchecks on a downstream server, be sure
to include the `check` argument in the server config (see the last line), i.e.:

```
backend app_fastapi_http
  mode http
  option forwardfor
  http-request replace-uri /fastapi/app[/]?(.*) /\1 if { path_beg /fastapi/app }
  server app_fastapi app_fastapi:80 check
 ```

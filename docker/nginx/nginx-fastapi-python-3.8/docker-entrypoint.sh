#!/bin/sh
set -eup

ENTRYPOINT=/usr/bin/supervisord
SITES_DIR=/etc/nginx/sites
SITES_AVAILABLE_DIR=/etc/nginx/sites-available
SITES_ENABLED_DIR=/etc/nginx/sites-enabled

if [ -z "${NGINX_ENTRYPOINT_QUIET_LOGS:-}" ]; then
  exec 3>&1
else
  exec 3>/dev/null
fi

configure() {
  if [ "$1" = "nginx" -o "$1" = "nginx-debug" ]; then
    if /usr/bin/find "/docker-entrypoint.d/" -mindepth 1 -maxdepth 1 -type f -print -quit 2>/dev/null | read v; then
      log "[DEBUG] /docker-entrypoint.d/ is not empty, will attempt to perform configuration"

      log "[INFO ] Looking for shell scripts in /docker-entrypoint.d/"
      find "/docker-entrypoint.d/" -follow -type f -print | sort -n | while read -r f; do
        case "$f" in
          *.sh)
            if [ -x "$f" ]; then
              log "[INFO ] Launching $f";
              "$f"
            else
              # warn on shell scripts without exec bit
              log "[INFO ] Ignoring $f, not executable";
            fi
            ;;
          *) log "[INFO ] Ignoring $f";;
        esac
      done

      log "[INFO ] Configuration complete; ready for start up"
    else
      log "[INFO ] No files found in /docker-entrypoint.d/, skipping configuration"
    fi
  fi
}

#: <summary>
#: Convenience method for logging from this entrypoint, prepends a timestamp
#: to the message written to the console.
#: </summary>
#: <param name="message" index=1>The message to write to the console.</param>
log() {
  message=$1
  time=$(date +"%F %T %Z")
  echo $time $1
}


#: <summary>
#: </summary>
#: <param name="from" index=1>The path to the link being created.</param>
#: <param name="to" index=2>The target of the link</param>
link() {
  link_from=$1
  link_to=$2

  log "[DEBUG] Linking $link_from -> $link_to"
  ln -sf $link_to $link_from
}


#: <summary>
#: Enable all of the available sites under nginx.
#:
#: This will iterate over all non-directories in `/etc/nginx/sites-available`
#: and create a symlink to the file from the `/etc/nginx/sites-enabled`
#: directory.
#: </summary>
enable_available_sites() {
  for target in $(find $SITES_AVAILABLE_DIR); do
    if [ ! -d $target ]; then
      link=$SITES_ENABLED_DIR/$(basename $target)
      log "[DEBUG] Enabling site: $link -> $target"
      ln -sf $target $link
    fi
  done
}

#: Visually separate breaks in log activity.
echo "\n\n"

configure "nginx"

log "[INFO ] Activating available nginx sites"
enable_available_sites

log "[INFO ] Starting web server"
log "[INFO ] $(date +'%b %d, %Y %H:%M:%S %z (%I:%M:%S %p %Z)')"
log "[DEBUG] > $ENTRYPOINT $@"

$ENTRYPOINT "$@"
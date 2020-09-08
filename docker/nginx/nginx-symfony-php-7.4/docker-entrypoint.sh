#!/bin/sh
set -eu

ENTRYPOINT=/usr/bin/supervisord
SITES_DIR=/etc/nginx/sites
SITES_AVAILABLE_DIR=/etc/nginx/sites-available
SITES_ENABLED_DIR=/etc/nginx/sites-enabled


#: <summary>
#: Convenience method for logging from this entrypoint, prepends a timestamp
#: to the message written to the console.
#: </summary>
#: <param name="message" index=1>The message to write to the console.</param>
log() {
  message=$1
  time=$(date +"%F %T %Z")
  echo -e $time $1
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
echo -e "\n\n"

log "[INFO ] Activating available nginx sites"
enable_available_sites

log "[INFO ] Starting web server"
log "[INFO ] $(date +'%b %d, %Y %H:%M:%S %z (%l:%M:%S %p %Z)')"
log "[DEBUG] > $ENTRYPOINT $@"

$ENTRYPOINT "$@"
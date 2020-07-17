#!/bin/sh
set -e

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
#: </summary>
configure() {
  log "[INFO ] Configuring runtime environment"
  #: TODO: In the future we can modify what links are made available based
  #:       on environment variables, or some more elaborate scheme.
  link $SITES_AVAILABLE_DIR/app.sandbox.com $SITES_DIR/app.sandbox.com/default.conf
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


#: <summary>
#: If the ENABLE_XDEBUG flag is set to `true` (or any case variation there of),
#: enable the XDebug extension using the Unix stream editor (sed) utility.  
#: </summary>
enable_xdebug() {
  log "[INFO ] Checking to see if XDebug should be enabled (ENABLE_XDEBUG=$ENABLE_XDEBUG)"
  if [ $(echo $ENABLE_XDEBUG | grep -i "^true$") ]; then
    log "[DEBUG] Enabling XDebug..."
    sed -i "s/^;zend_extension=xdebug.so$/zend_extension=xdebug.so/" /etc/php/mods-available/xdebug.ini
    log "[DEBUG] ... XDebug is now enabled!"
  else
    log "[DEBUG] Disabling XDebug..."
    sed -i "s/^zend_extension=xdebug.so$/;zend_extension=xdebug.so/" /etc/php/mods-available/xdebug.ini
    log "[DEBUG] ... XDebug is now disabled!"  
  fi
}


#: Visually separate breaks in log activity.
echo -e "\n\n"

log "[INFO ] Activating available nginx sites"
configure
enable_available_sites
enable_xdebug

log "[INFO ] Starting web server"
log "[INFO ] $(date +'%b %d, %Y %H:%M:%S %z (%l:%M:%S %p %Z)')"
log "[DEBUG] > $ENTRYPOINT $@"

$ENTRYPOINT "$@"
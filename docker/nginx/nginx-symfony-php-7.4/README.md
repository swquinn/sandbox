nginx-symfony-php-5.6
=====================

This NGINX Docker image is an intermediate image that is based on the Symfony
PHP 5.6 image and contains both the NGINX application as well as Supervisor
which is used to control the NGINX process.

This image downloads/builds/installs the NGINX and Supervisor applications
while the Docker images, such as the `sandbox-server-api`, that are built on
top of this further configure those applications.

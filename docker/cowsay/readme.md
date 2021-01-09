docker rm -v $(docker ps -aq -f status=exited) - delete all stopped containers
docker stop $(docker container ls -aq) - stop all containers
docker rmi idImage - remove image from a local machine

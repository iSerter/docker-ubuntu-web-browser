# docker-ubuntu-web-browser
Tools for my web browser experiments.

### Building the Docker Image

To build the Docker image, navigate to the directory containing the `Dockerfile` and run the following command:

```sh
docker build -t ubuntu-web-browser .
```

### Run a container 
```sh
docker run -d -p 3030:3030 --name web-browser ubuntu-web-browser
```


### Publishing the image 

```sh
docker tag ubuntu-web-browser iserter/ubuntu-web-browser:latest
```

```sh 
docker push iserter/ubuntu-web-browser:latest
```


### Pulling from Ducker Hub
```sh
docker pull iserter/ubuntu-web-browser:latest
```


### Running from Ducker Hub
```sh 
docker run -d -p 3030:3030 --name my-web-browser iserter/ubuntu-web-browser:latest
```
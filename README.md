# docker-ubuntu-web-browser
A basic setup for my web browser experiments.
- *Xvfb* session to run chrome with `headless:false`
- browser-service.js runs as a background service, always having a chrome ready.
- - no need to start/shutdown a browser for each request. the browser should stay open.
- `/browse` endpoint receives a web-request, writes it to redis queue where browser-service picks it up, handles it, and writes the result back to redis. 
- - `/browse` endpoint checks the request status every 70ms with a 30s timeout.


### Building the Docker Image

To build the Docker image, navigate to the directory containing the `Dockerfile` and run the following command:

If on MacOS, run `export DOCKER_DEFAULT_PLATFORM=linux/amd64` first. 

```sh
docker build -t ubuntu-web-browser . 
```
OR
```sh
docker buildx build --platform linux/amd64 -t ubuntu-web-browser . 
```

### Run a container 
```sh
docker run -d -p 3030:3030 --name web-browser ubuntu-web-browser
```
May need to add ` --shm-size=1gb` for chrome. 

### Go inside
```sh
docker exec -it web-browser /bin/bash
```

### Use / Test
```
curl http://127.0.0.1:3030/
```

```sh
curl -X POST http://127.0.0.1:3030/browse -d '{"url": "https://iserter.com/"}'
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


### TODO 

- Run multiple browsers, handle multiple requests concurrently.
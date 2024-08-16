# Dockerized Web Browsers [WIP]
A basic setup for my web browser experiments. Starting with Puppeteer first.
- `queue-workers.js` runs multiple browsers with a dedicated `xvfb` display for each.
- - With `xvfb` sessions, we can launch `headless:false` chrome instances
- - no need to start/shutdown a browser for each request. the browsers should stay open.
- `/browse` endpoint receives a web-request, writes it to **redis** queue and waits for its completion.
- - it checks the request status every 70ms with a 30s timeout.


### Building the Docker Image

/!\ On MacOS, use Colima to run docker. https://stackoverflow.com/a/75047502


```sh
docker buildx build --platform linux/amd64 -t web-browsers . 
```

### Run a container 
```sh
docker run --cap-add=SYS_ADMIN --platform linux/amd64 -d -p 3030:3030 --name my-web-browsers web-browsers
```
May need to add ` --shm-size=1gb` for chrome. 

### Go inside
```sh
docker exec -it my-web-browsers /bin/bash
```

### Usage

```sh
curl -X POST http://127.0.0.1:3030/browse -d '{"url": "https://iserter.com/"}'
```

For a quick verification of the API server's availability: `curl http://127.0.0.1:3030/`


### Publishing the image 

```sh
docker tag web-browsers iserter/web-browsers:latest
```

```sh 
docker push iserter/web-browsers:latest
```


### Pulling from Ducker Hub
```sh
docker pull iserter/web-browsers:latest
```


### Running from Ducker Hub
```sh 
docker run -d -p 3030:3030 --name my-web-browsers iserter/web-browsers:latest
```

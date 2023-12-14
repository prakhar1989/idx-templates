## FastAPI

A Python FastAPI starter example as per the docs: https://fastapi.tiangolo.com/#example

Run the following command in the terminal to call the API 

```
curl http://localhost:9002
```

or use Thunder client (via the sidebar or command pallete) to send a request to `http://localhost:9002`

# Dev

The server auto-reloads - just refresh the preview after making any changes.


# Deploy

Login to gcloud CLI and run 

```
gcloud run deploy --source .
```
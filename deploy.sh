
docker build . -t gcr.io/cerbos-playground/demo-express-auth0-cerbos:latest
docker push gcr.io/cerbos-playground/demo-express-auth0-cerbos:latest

gcloud --project cerbos-playground run deploy --platform managed --region europe-west1 --image gcr.io/cerbos-playground/demo-express-auth0-cerbos:latest demo-express-auth0-cerbos
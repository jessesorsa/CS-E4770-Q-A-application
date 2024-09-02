## Running application

# Dev version
1. In qa-ui folder run: 
- npm install 
- npm install -D tailwindcss@latest @tailwindcss/typography postcss@latest autoprefixer@latest daisyui@latest
- npx tailwindcss init
2. In qa-app folder run:
- docker compose up
3. On browser navigate to http://localhost:7800/


# Prod version
1. In qa-ui folder run (if not already run): 
- npm install 
- npm install -D tailwindcss@latest @tailwindcss/typography postcss@latest autoprefixer@latest daisyui@latest
- npx tailwindcss init
2. In qa-app folder run:
- docker compose -f docker-compose.prod.yml up -d
3. On browser navigate to http://localhost:7800/


# Kubernetes
!!! I could not get the pod to pod communications to work, and gave up trying, but still left the already existing files here !!!

- I tried exposing the nginx service, using ingress as a reverse proxy, and directly exposing the ui but could not get the communications to work


I was able to get minikube running with this:
1. In qa-app run:
- minikube start
2. In each folder (flyway, llm-api, nginx, qa-api, qa-ui, redis) build the corresponding image:
- minikube image build -t <name of the file (usually the folder)> -f ./Dockerfile .
3. In qa-app run:
- kubectl apply -f https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/release-1.19/releases/cnpg-1.19.1.yaml 
4. In qa-app run each of the configuration files (deployments, services, cluster and jobs) in kubernetes folder using:
- kubectl apply -f kubernetes/<name-of-the-config-file>.yaml
(5. Expose the service)


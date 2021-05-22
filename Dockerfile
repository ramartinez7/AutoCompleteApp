FROM node:16-alpine3.13 as build-step
RUN npm install -g npm@latest
RUN mkdir -p /app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm run build --prod

FROM nginx:1.20-alpine
COPY --from=build-step /app/dist/AutoCompleteApp /usr/share/nginx/html

# dist folder name is case sensitive

#docker build -t ramartinez7/autocompleteapp .
#docker build --pull --rm -f "Dockerfile" -t autocompleteapp:latest .
#docker images 
#docker run -d -it -p 80:80/tcp --name autocompleteapp ramartinez7/autocompleteapp
#use -d to persist container after stop
#docker run --rm -d  -p 80:80/tcp ramartinez7/autocompleteapp:latest
#docker run --rm -it  -p 80:80/tcp ramartinez7/autocompleteapp
#use -rm to remove container when it stopped
# mapping ports the first one is the port from outside
#docker ps
#docker stop {container-id}
#docker container rm 20cf
#docker start 
#docker exec -it 126727da7a3629825da49c5c7d4a3a562372714a0a5c979572bf612423d68042 sh
#to open console from container
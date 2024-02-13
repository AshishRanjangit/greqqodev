FROM node:18.12.1

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]
RUN npm install -g typescript
COPY ./ ./
RUN npm install
CMD ["npm" , "start"]

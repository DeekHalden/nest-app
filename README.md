# nest-app


# Prerequisites
## Should have docker and docker-compose installed on local machine
1. [docker installation link](https://docs.docker.com/get-docker/)
2. navigate to backend folder 
3. should run to launch db container 
```
docker-compose up --build -d
```
4. 
```
npm install
npm run start:dev
```
5. to apply all the neccessary migrations run 
```
npm run build
npm run migration:run
```

6. Required: to populate db with default user roles run ```npm run generate:fixtures```

7. to rollback migration process ```npm run migration:revert```




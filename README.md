# Bydlac

A Django-React Full-Stack App for chatting with other users and creating events in real life.
This project was created for our studies.

## Project group

* [Kacper Cienkosz](https://github.com/kacienk) -- Backend, Docker, Documentation
* [Miłosz Dubiel](https://github.com/dubielel) -- Frontend, Documentation
* [Karol Błaszczak](https://github.com/karcio424) -- Documentation
* [Krystian Sitarz](https://github.com/Sitaarz) -- Documentation

## Technologies

* Backend: Django, django-rest-framework
* Backend tests: pytest
* Frontend: React
* Database: Postgres

We used Docker for deployment.
For static code analysis we used SonarQube.
In the future we want to setup Django and React on nginx.

## Project structure

All the backend stuff (including backend data and database data ignored in VCS) are located in Backend folder.
All the frontend stuff are in Frontend folder.
Folder Documentation id where we keep all the files not connected to the code that were requiered for our studies.

```
Bydlac
├── Backend
│   ├── api
│   ├── base
│   ├── bydlac_backend
│   ├── data # ignored in gitignore, database data
│   └── tests
│       └── api 
├── Documentation
│   ├── AnalizaRyzyka
│   ├── OpisInterfejsow
│   ├── SonarQube
│   ├── UML
│   └── UseCases
└── Frontend
    └── bydlac_frontend
        ├── public
        └── src
            ├── components
            ├── context
            ├── images
            └── pages
```

## Setup

To run this up you need to use Docker and docker-compose. [How to get docker?](https://docs.docker.com/get-docker/).

Proper .env file should be created in parent directory (Bydlac). For safety purpose it is not included in VCS.

Before the first launch you need to build and apply django migrations.
To do that you need to run from parent directory following commands:

``` sh
docker compose build
docker compose run backend python /backend/manage.py migrate --no-input 
```

To launch app you need to run from parent directory:

``` sh
docker compose up
```

All 3 containers (backend, frontend, postgres) should log to the console that they are up and running.
At this point to use the app, you need to type http://localhost:3000 in your browser.

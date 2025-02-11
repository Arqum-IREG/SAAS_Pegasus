FROM node:22-bookworm

# create code directory
RUN mkdir /code
WORKDIR /code

RUN mkdir /code/api-client/
COPY api-client /code/api-client/

RUN mkdir /code/frontend/
WORKDIR /code/frontend/

COPY frontend/package.json package.json
RUN npm install

# copy code files
COPY . /code/

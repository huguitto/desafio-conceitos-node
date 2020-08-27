const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

//Middlewares

function controlRequests(request, response, next) {
  const { method, url } = request;

  const info = `[${method.toUpperCase()}] ${url}`;
  console.log(info);

  return next();
}

function validateId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    response.status(400).json({ error: "Invalid repository Id." });
  }
  return next();
}

app.use(controlRequests);
app.use("/repositories/:id", validateId);
//END Middlewares

app.get("/repositories", (request, response) => {
  // TODO
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  // TODO
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0,
  };
  repositories.push(repository);

  response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  // TODO
  const { id } = request.params;
  const { title, url, techs } = request.body;

  //Search - index
  const repositoryIndex = repositories.findIndex((item) => item.id === id);
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  //Update repository
  const respositoryUpdated = {
    ...repositories[repositoryIndex],
    title: title,
    url: url,
    techs: techs,
  };

  //Save Updated repository
  repositories[repositoryIndex] = respositoryUpdated;

  //Send a response
  return response.json(respositoryUpdated);
});

app.delete("/repositories/:id", (request, response) => {
  // TODO

  //Search index
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex((item) => item.id === id);
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  //Delete repository
  repositories.splice(repositoryIndex, 1);

  //Send a response
  response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
  //Search index
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex((item) => item.id === id);

  //If - repository exists?
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  //Update likes
  repositories[repositoryIndex].likes++;
  return response.json(repositories[repositoryIndex]);
});

module.exports = app;

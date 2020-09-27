const jsonServer = require("json-server");
const server = jsonServer.create();
const path = require("path");
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

const cors = require("cors");

server.use(cors());

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.get("/", function (req, res, next) {
  next();
});

server.post("/", function (req, res, next) {
  const error = validateRequestBody(req.body);
  if (!error) {
    next();
  } else {
    res.status(400).send(error);
  }
});

server.use(router);

const port = 3001;
server.listen(port, () => console.log(`API server is running on port ${port}`));

function validateRequestBody(requestsBody) {
  return "";
}

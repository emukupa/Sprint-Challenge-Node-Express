// bring in express, morgan, helmet, cors
const express = require(`express`);
const morgan = require(`morgan`);
const helmet = require(`helmet`);
const cors = require(`cors`);

// bring in the config file;
const config = require('./api/config.js');

// bring in the projectRouter.js and actionRouter.js
const projectRouter = require('./projects/projectRouter.js');
const actionRouter = require('./actions/actionRouter.js');

// create a server
const server = express();

//add middlewares

// to enable json parsing
server.use(express.json());

//logging, TBD: create morganOptions and pass it in, instead
server.use(morgan('dev'));

//security
server.use(helmet());

//cross origin request sharing permissions
const corsOptions = {
  origin: '*',
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
server.use(cors(corsOptions));

// use the projectRouter and actionRouter
server.use('/api/projects', projectRouter);
server.use('/api/actions', actionRouter);

// root get request
server.get(`/`, (req, res) =>
  // send a json response
  res.json({ api: `API is running successfully!!` })
);

// define a port to use
const port = config.port || 5000;

// start listening to server requests
server.listen(port, () =>
  console.log(`Projects, Actions API is running on port  ${port}!!`)
);

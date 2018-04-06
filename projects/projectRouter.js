// bring in express, projectModel and config
const express = require('express');
const projectModel = require('../data/helpers/projectModel');
const config = require('../api/config.js');

// instantiate a router
const router = express.Router();

/* These requests handles routes that start with: /api/projects */

// get projects
router.get(`/`, (req, res) => {
  projectModel
    .get()
    .then(projects => {
      if (projects.length > 0) {
        // checks if any projects were found
        res.status(200).json(projects);
      } else {
        res.status(404).json({ message: `No projects found!` }); // no projects found
      }
    })
    .catch(err => {
      // Only display errors if in development mode
      const errDetails = config.env === 'development' ? err : '';
      res
        .status(500)
        .json({ error: `The projects could not be retrieved. ${errDetails}` }); // database error
    });
});

//get project by id
router.get(`/:id`, (req, res) => {
  const { id } = req.params;
  projectModel
    .get(id)
    .then(project => {
      if (Object.keys(project).length > 0) {
        res.status(200).json(project);
      } else {
        res.status(404).json({ message: `The project does not exist.` }); // project doesn't exist
      }
    })
    .catch(err => {
      // Only display errors if in development mode
      const errDetails = config.env === 'development' ? err : '';
      res.status(500).json({
        error: `The project information could not be retrieved. ${errDetails}`,
      }); // database error
    });
});

//export the router
module.exports = router;

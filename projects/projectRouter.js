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

//post new project
router.post(`/`, (req, res) => {
  const newProject = req.body !== undefined ? req.body : {};

  // check if the name is provided
  if (newProject.name === undefined) {
    res.status(400).json({ errorMessage: `A project name is required.` });
    return;
  }

  // check if the name is less than 128 characters
  if (newProject.name.length > 128) {
    res.status(400).json({
      errorMessage: `The project name can only be a maximum of 128 characters.`,
    });
    return;
  }

  // check that a description is provided
  if (newProject.description === undefined) {
    res
      .status(400)
      .json({ errorMessage: `Provide a description for the project.` });
    return;
  }

  // check that description's character length is less than 128
  if (newProject.description.length > 128) {
    res.status(400).json({
      errorMessage: `The project description can only have a max characters of 128.`,
    });
    return;
  }

  const completed =
    newProject.completed !== undefined ? newProject.completed : false;

  const checkedProject = Object.assign(newProject, { completed: completed });

  //insert it in the database
  projectModel
    .insert(checkedProject)
    .then(response => {
      projectModel.get(response.id).then(project => {
        if (Object.keys(project).length > 0) {
          res.status(200).json(project);
        } else {
          res.status(404).json({ message: `The project was not created.` }); // project doesn't exist, so was not created
        }
      });
    })
    .catch(err => {
      // Only display errors if in development mode
      const errDetails = config.env === 'development' ? err : '';
      res.status(500).json({
        error: `There was an error while saving the project to the database. ${errDetails}`,
      });
    });
});

// update project with given id
router.put(`/:id`, (req, res) => {
  const { id } = req.params;
  const projectUpdates = req.body ? req.body : {};

  // update
  projectModel
    .update(id, projectUpdates)
    .then(updatedProject => {
      if (Object.keys(updatedProject).length > 0) {
        // update done
        res.status(200).json(updatedProject);
      } else {
        res.status(404).json({ message: `The project was not updated.` }); // nothing was updated
      }
    })
    .catch(error => {
      // Only display errors if in development mode
      const errDetails = config.env === 'development' ? err : '';
      res.status(500).json({
        error: `The project information could not be modified. ${errDetails}`,
      }); // database error
    });
});

//delete project with given id
router.delete(`/:id`, (req, res) => {
  const { id } = req.params;
  projectModel
    .get(id)
    .then(response => {
      if (Object.keys(response).length > 0) {
        // make a copy of the project
        const project = Object.assign(response);
        projectModel.remove(id).then(count => {
          res.status(200).json(project); // send the project deleted back with the response
        });
      } else {
        res.status(404).json({ message: `The project was not deleted.` }); // project doesn't exist?? somehow!!
      }
    })
    .catch(err => {
      // Only display errors if in development mode
      const errDetails = config.env === 'development' ? err : '';
      res
        .status(500)
        .json({ error: `The project could not be removed. ${errDetails}` }); // database error
    });
});

//export the router
module.exports = router;

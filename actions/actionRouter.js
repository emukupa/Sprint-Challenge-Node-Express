// bring in express, the actionModel and the config,
const express = require('express');
const actionModel = require('../data/helpers/actionModel');
const config = require('../api/config.js');

// instantiate a router
const router = express.Router();

/* These requests handles routes that start with: /api/actions */

// get actions
router.get(`/`, (req, res) => {
  actionModel
    .get()
    .then(actions => {
      if (actions.length > 0) {
        // checks if any actions were found
        res.status(200).json(actions);
      } else {
        res.status(404).json({ message: `No actions found!` }); // no actions found
      }
    })
    .catch(err => {
      // Only display errors if in development mode
      const errDetails = config.env === 'development' ? err : '';
      res
        .status(500)
        .json({ error: `The actions could not be retrieved. ${errDetails}` }); // database error
    });
});

//get action by id
router.get(`/:id`, (req, res) => {
  const { id } = req.params;
  actionModel
    .get(id)
    .then(action => {
      if (Object.keys(action).length > 0) {
        res.status(200).json(action);
      } else {
        res.status(404).json({ message: `The action does not exist.` }); // action doesn't exist
      }
    })
    .catch(err => {
      // Only display errors if in development mode
      const errDetails = config.env === 'development' ? err : '';
      res.status(500).json({
        error: `The action information could not be retrieved. ${errDetails}`,
      }); // database error
    });
});

//post new action
router.post(`/`, (req, res) => {
  const newAction = req.body !== undefined ? req.body : {};

  // check if the project id is provided
  if (newAction.project_id === undefined) {
    res.status(400).json({ errorMessage: `A project id is needed.` });
    return;
  }

  // check if the project id is a number
  if (!Number(newAction.project_id)) {
    res.status(400).json({ errorMessage: `A project id must be numeric.` });
    return;
  }

  // check if the project id exists
  // if (newAction.project_id === "EXIST") {

  // }

  // check that a description is provided
  if (newAction.description === undefined) {
    res
      .status(400)
      .json({ errorMessage: `Provide a description for the action.` });
    return;
  }

  // check that description's character length is less than 128
  if (newAction.description.length > 128) {
    res.status(400).json({
      errorMessage: `The action description can only have a max characters of 128.`,
    });
    return;
  }

  const completed =
    newAction.completed !== undefined ? newAction.completed : false;
  const notes = newAction.notes !== undefined ? newAction.notes : '';

  const checkedActions = Object.assign(newAction, {
    completed: completed,
    notes: notes,
  });

  //insert it in the database
  actionModel
    .insert(checkedActions)
    .then(response => {
      actionModel.get(response.id).then(action => {
        if (Object.keys(action).length > 0) {
          res.status(200).json(action);
        } else {
          res.status(404).json({ message: `The action was not created.` }); // action doesn't exist, so was not created
        }
      });
    })
    .catch(err => {
      // Only display errors if in development mode
      const errDetails = config.env === 'development' ? err : '';
      res.status(500).json({
        error: `There was an error while saving the action to the database. ${errDetails}`,
      });
    });
});

// update action with given id
router.put(`/:id`, (req, res) => {
  const { id } = req.params;
  const actionUpdates = req.body ? req.body : {};

  // update
  actionModel
    .update(id, actionUpdates)
    .then(updatedAction => {
      if (Object.keys(updatedAction).length > 0) {
        // update done
        res.status(200).json(updatedAction);
      } else {
        res.status(404).json({ message: `The action was not updated.` }); // nothing was updated
      }
    })
    .catch(error => {
      // Only display errors if in development mode
      const errDetails = config.env === 'development' ? err : '';
      res.status(500).json({
        error: `The action information could not be modified. ${errDetails}`,
      }); // database error
    });
});

//delete action with given id
router.delete(`/:id`, (req, res) => {
  const { id } = req.params;
  actionModel
    .get(id)
    .then(response => {
      if (Object.keys(response).length > 0) {
        // make a copy of the action
        const action = Object.assign(response);
        actionModel.remove(id).then(count => {
          res.status(200).json(action); // send the action deleted back with the response
        });
      } else {
        res.status(404).json({ message: `The action was not deleted.` }); // action doesn't exist?? somehow!!
      }
    })
    .catch(err => {
      // Only display errors if in development mode
      const errDetails = config.env === 'development' ? err : '';
      res
        .status(500)
        .json({ error: `The action could not be removed. ${errDetails}` }); // database error
    });
});

//export the router
module.exports = router;

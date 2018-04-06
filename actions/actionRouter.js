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

//export the router
module.exports = router;

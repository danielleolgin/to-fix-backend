'use strict';
var Joi = require('joi');
var ControllerTasks = require('./../controllers/ControllerTasks');

module.exports = [{
  method: 'GET',
  path: '/tasks',
  config: {
    description: 'Returns all the list of existing tasks',
    handler: ControllerTasks.listTasks
  }
}, {
  method: 'GET',
  path: '/tasks/{idtask}',
  config: {
    description: 'Returns a specific tasks',
    validate: {
      params: {
        idtask: Joi.string().required()
      }
    },
    handler: ControllerTasks.listTasksById
  }
}, {
  method: 'POST',
  path: '/tasks',
  config: {
    description: 'Create a task',
    validate: {
      payload: {
        name: Joi.string().required(),
        description: Joi.string().required(),
        changesetComment: Joi.string().required(),
        password: Joi.string().required(),
        file: Joi.object().required()
      }
    },
    payload: {
      maxBytes: 300000000,
      output: 'stream',
      parse: true,
      allow: 'multipart/form-data'
    },
    handler: ControllerTasks.createTasks
  }
}, {
  method: 'PUT',
  path: '/tasks',
  config: {
    description: 'Update a task',
    validate: {
      payload: {
        idtask: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string().required(),
        changesetComment: Joi.string().required(),
        password: Joi.string().required(),
        isCompleted: Joi.string().required(), // false = if a task is flagged as completed by user
        file: Joi.object()
      }
    },
    payload: {
      maxBytes: 300000000,
      output: 'stream',
      parse: true,
      allow: 'multipart/form-data'
    },
    handler: ControllerTasks.updateTasks
  }
}, {
  method: 'DELETE',
  path: '/tasks',
  config: {
    description: 'Delete a specific task',
    validate: {
      payload: {
        idtask: Joi.string().required(),
        password: Joi.string().required()
      }
    },
    handler: ControllerTasks.deleteTasks
  }
}];

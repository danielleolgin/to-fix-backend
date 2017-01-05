'use strict';
var Joi = require('joi');
var controllerUsers = require('./../controllers/ControllerUsers');

module.exports = [{
  method: 'GET',
  path: '/handle_openstreetmap_callback',
  handler: controllerUsers.auth
}, {
  method: 'GET',
  path: '/users',
  handler: controllerUsers.listUsers
}, {
  method: 'GET',
  path: '/users/{user}',
  config: {
    description: 'Returns user detail',
    validate: {
      params: {
        user: Joi.string().required()
      }
    },
    handler: controllerUsers.getUser
  }
}, {
  method: 'PUT',
  path: '/users',
  config: {
    auth: {
      strategies: ['jwt'],
      scope: ['superadmin']
    },
    description: 'Change user role',
    validate: {
      payload: {
        user: Joi.string().required(),
        role: Joi.string().valid('superadmin', 'admin', 'editor').required()
      }
    },
    handler: controllerUsers.changeRole
  }
}, {
  method: 'DELETE',
  path: '/users',
  config: {
    auth: {
      strategies: ['jwt'],
      scope: ['superadmin']
    },
    description: 'Delete a user',
    validate: {
      payload: {
        user: Joi.string().required()
      }
    },
    handler: controllerUsers.deleteUser
  }
}];

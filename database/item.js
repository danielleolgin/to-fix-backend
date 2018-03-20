const Sequelize = require('sequelize');
const _ = require('lodash');

module.exports = function(db) {
  var Item = db.define(
    'item',
    {
      auto_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: 'projectItemId'
      },
      project_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: 'projectItemId'
      },
      pin: {
        type: Sequelize.GEOMETRY('POINT', 4326),
        allowNull: false
      },
      quadkey: {
        type: Sequelize.STRING,
        allowNull: true
      },
      instructions: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdBy: {
        type: Sequelize.STRING,
        allowNull: false
      },
      featureCollection: {
        type: Sequelize.JSONB, // does postgis have a featureCollection
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'open'
      },
      lockedTill: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      lockedBy: {
        type: Sequelize.STRING
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {}
      },
      sort: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      is_archived: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      lastModifiedBy: {
        type: Sequelize.STRING,
        defaultValue: ''
      },
      lastModifiedDate: {
        type: Sequelize.STRING,
        defaultValue: ''
      }
    },
    {
      indexes: [
        {
          fields: ['status']
        },
        {
          fields: ['lockedTill']
        },
        {
          fields: ['createdAt']
        },
        {
          fields: ['quadkey']
        },
        {
          fields: ['is_archived']
        },
        {
          fields: ['pin'],
          using: 'gist'
        },
        {
          fields: ['id', 'project_id'],
          unique: true
        }
      ]
    }
  );

  Item.prototype.toJSON = function() {
    return _.omit(this.dataValues, 'auto_id', 'is_archived');
  };

  /**
    This is a bit of a hack to get incoming GeoJSON saved with the correct
    SRID in the database.
    Ideally, we would not modify the GeoJSON but enforce saving into the database
    with something like ST_SetSrid(St_FromGeoJson(geojson), 4326) but I'm not quite
    sure how to do this with Sequelize, so this will probably do for now.
  */
  Item.beforeSave(model => {
    if (!model.pin.crs) {
      model.pin.crs = { type: 'name', properties: { name: 'EPSG:4326' } };
    }
  });

  return Item;
};

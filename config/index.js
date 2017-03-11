const config = require(`./${process.env.NODE_ENV || 'production'}.json`);

config.relations = require('./relations.json');

module.exports = config;

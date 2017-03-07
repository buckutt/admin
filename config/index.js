const envs = require.context('./', false, /\.json$/);

const config = envs(`./${process.env.NODE_ENV || 'production'}.json`);

config.relations = require('./relations.json');

export default config;

function createClient(options) {
    options = options || {};
    var provider = options.provider || 'filesystem';

    if ('function' !== typeof provider) {
        try {
            // Try to load the provider from providers folder
            provider = require('./providers/' + provider);
        } catch (err) {
            // Fall back to pkgcloud
            return require('pkgcloud').storage.createClient(options);
        }
    }

    return new provider(options);

}

module.exports =  createClient;
module.exports.createClient = createClient;
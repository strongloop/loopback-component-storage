/**
 * Create a client instance based on the options
 * @param options
 * @returns {*}
 */
function createClient(options) {
    options = options || {};
    var provider = options.provider || 'filesystem';

    try {
        // Try to load the provider from providers folder
        provider = require('./providers/' + provider);
        return provider.createClient(options);
    } catch (err) {
        // Fall back to pkgcloud
        return require('pkgcloud').storage.createClient(options);
    }
}

/**
 * Look up a provider by name
 * @param provider
 * @returns {*}
 */
function getProvider(provider) {
    try {
        // Try to load the provider from providers folder
       return require('./providers/' + provider);
    } catch (err) {
        // Fall back to pkgcloud
        return require('pkgcloud').providers[provider];
    }
}

module.exports.createClient = createClient;
module.exports.getProvider = getProvider;
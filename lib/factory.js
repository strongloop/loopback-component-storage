/*!
 * Patch the pkgcloud Container/File classes so that the metadata are separately
 * stored for JSON serialization
 *
 * @param {String} provider The name of the storage provider
 */
function patchContainerAndFileClass(provider) {
  var storageProvider = getProvider(provider).storage;

  var Container = storageProvider.Container;
  var m1 = Container.prototype._setProperties;
  Container.prototype._setProperties = function (details) {
    this.metadata = details;
    m1.call(this, details);
  }

  Container.prototype.toJSON = function() {
    return this.metadata;
  };

  var File = storageProvider.File;
  var m2 = File.prototype._setProperties;
  File.prototype._setProperties = function (details) {
    this.metadata = details;
    m2.call(this, details);
  };

  File.prototype.toJSON = function() {
    return this.metadata;
  };
}
/**
 * Create a client instance based on the options
 * @param options
 * @returns {*}
 */
function createClient(options) {
  options = options || {};
  var provider = options.provider || 'filesystem';
  var handler;

  try {
    // Try to load the provider from providers folder
    handler = require('./providers/' + provider);
  } catch (err) {
    // Fall back to pkgcloud
    handler = require('pkgcloud').storage;
  }
  patchContainerAndFileClass(provider);
  return handler.createClient(options);
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

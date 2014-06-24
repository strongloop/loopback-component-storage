var pkgcloud = require('pkgcloud');

/*!
 * Patch the prototype for a given subclass of Container or File
 * @param {Function} cls The subclass
 */
function patchBaseClass(cls) {
  var proto = cls.prototype;
  var found = false;
  // Find the prototype that owns the _setProperties method
  while (proto
    && proto.constructor !== pkgcloud.storage.Container
    && proto.constructor !== pkgcloud.storage.File) {
    if (proto.hasOwnProperty('_setProperties')) {
      found = true;
      break;
    } else {
      proto = Object.getPrototypeOf(proto);
    }
  }
  if (!found) {
    proto = cls.prototype;
  }
  var m1 = proto._setProperties;
  proto._setProperties = function (details) {
    // Use an empty object to receive the calculated properties from details
    var receiver = {};
    // Pass in some context as non-enumerable properties
    Object.defineProperties(receiver, {
      client: {value: this.client},
      files: {value: this.files}
    });
    m1.call(receiver, details);
    // Apply the calculated properties to this
    for (var p in receiver) {
      this[p] = receiver[p];
    }
    // Keep references to raw and the calculated properties
    this._rawMetadata = details;
    this._metadata = receiver; // Use _metadata to avoid conflicts
  }

  proto.toJSON = function () {
    return this._metadata;
  };

  proto.getMetadata = function () {
    return this._metadata;
  };

  proto.getRawMetadata = function () {
    return this._rawMetadata;
  };

}
/*!
 * Patch the pkgcloud Container/File classes so that the metadata are separately
 * stored for JSON serialization
 *
 * @param {String} provider The name of the storage provider
 */
function patchContainerAndFileClass(provider) {
  var storageProvider = getProvider(provider).storage;

  patchBaseClass(storageProvider.Container);
  patchBaseClass(storageProvider.File);
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

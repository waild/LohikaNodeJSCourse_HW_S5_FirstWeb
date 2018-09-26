const rp = require('request-promise');

function getJson(uri) {
  const options = {
    method: 'GET',
    uri,
    headers: {
      'User-Agent': 'Request-Promise',
    },
    json: true,
  };
  return rp(options);
}

function postJson(uri, data) {
  const options = {
    method: 'POST',
    body: data,
    uri,
    headers: {
      'User-Agent': 'Request-Promise',
    },
    json: true,
    resolveWithFullResponse: true,
  };
  return rp(options);
}

module.exports = {
  getJson, postJson,
};

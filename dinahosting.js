const request = require('request-promise-native')
const isEquivalent = require('./isequivalent')

const IP_RESOLVER_HTTP_URLS = process.env.IP_RESOLVER_HTTP_URLS || ['http://dinadns01.dinaserver.com', 'http://dinadns02.dinaserver.com']
const DINAHOSTING_API_URL = process.env.DINAHOSTING_API_URL || 'https://dinahosting.com/special/api.php'
const DINAHOSTING_USER_AGENT = process.env.DINAHOSTING_USER_AGENT || 'dinaip-perl/1.0 '
const DINAHOSTING_CONTENT_TYPE = process.env.DINAHOSTING_CONTENT_TYPE || 'application/json'
const DINAHOSTING_API_KEY = process.env.DINAHOSTING_API_KEY
const DINAHOSTING_DOMAIN_TO_UPDATE = process.env.DINAHOSTING_DOMAIN_TO_UPDATE || 'semprebeta.gal'

function HTTPGetRequestPromise(requestOptions) {
  return request.get(requestOptions)
}

function IPResolveRequestPromise(url) {
  return HTTPGetRequestPromise({ url: url }).then((result) => new Object({ ip: result }))
}

function MultiIPResolveRequestPromise() {
  const resolvers = IP_RESOLVER_HTTP_URLS.map((resolver_url) => new IPResolveRequestPromise(resolver_url))
  return Promise.all(resolvers).then((results) => {
    results = results.sort().filter(function (item, pos, ary) {
      return !(pos && isEquivalent(item, ary[pos - 1]))
    })
   
    console.log('Resolvers returned %j', results)

    return results[0]
  })
}

function RequestCommandDinahostingPromise(command, params) {
  return request.post({
    url: DINAHOSTING_API_URL,
    headers: {
      'User-Agent': DINAHOSTING_USER_AGENT,
      'Content-Type': DINAHOSTING_CONTENT_TYPE,
      'Authorization': 'Basic ' + DINAHOSTING_API_KEY
    },
    json: true,
    body: {
      'method': command,
      'params': params
    }
  })
}

function RequestValidateCredentialsDinahostingPromise() {
  return new RequestCommandDinahostingPromise('User_GetInfo', {})
}

function RequestListOfManagedServicesDinahostingPromise() {
  return new RequestCommandDinahostingPromise('User_GetServices', {})
}

function RequestZoneListOfDomainDinahostingPromise() {
  return new RequestCommandDinahostingPromise('Domain_Zone_GetAll', { domain: DINAHOSTING_DOMAIN_TO_UPDATE })
}

function DomainZoneTypeAUpdateIpDinahostingPromise(zone, ip) {
  return new RequestCommandDinahostingPromise('Domain_Zone_UpdateTypeA', { domain: DINAHOSTING_DOMAIN_TO_UPDATE, hostname: zone, ip: ip })
}

module.exports.update = function () {
  console.log('Signal update to dinahosting')
  var ip = null

  return new MultiIPResolveRequestPromise()
    .then((result) => {
      console.log('Got IP %j', result)
      ip = result.ip
      return new RequestValidateCredentialsDinahostingPromise()
    }).then((result) => {
      console.log('Validated user %j', result)
      return new RequestListOfManagedServicesDinahostingPromise()
    }).then((result) => {
      console.log('List of services %j', result)
      if (result.data.some((e) => e.service === DINAHOSTING_DOMAIN_TO_UPDATE)) {
        return new RequestZoneListOfDomainDinahostingPromise()
      } 

      return Promise.reject('Configured domain %s not in list of user\'s domains', DINAHOSTING_DOMAIN_TO_UPDATE)
    }).then((result) => {
      console.log('List of zones %j', result)

      return Promise.all(result.data.filter((e) => e.type === 'A' && e.ip !== ip).map((e) => new DomainZoneTypeAUpdateIpDinahostingPromise(e.hostname, ip)))
    }).then((result) => {
      console.log('Result of updates %j', result)

      return Promise.resolve()
    }).catch((error) => console.error('ERRORED: %j', error))
}

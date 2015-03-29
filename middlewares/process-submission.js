var xform2json = require('xform-to-json')
var extend = require('xtend')
var debug = require('debug')('simple-odk:process-submission')

var defaults = {
  geojson: true
}

/**
 * Converts form xml in `req.body` to json, adds meta data, attaches data to
 * `req.submission`
 */
function ProcessSubmission (options) {
  return function (req, res, next) {
    var t0 = Date.now()

    if (!req.body.length) {
      return next(new Error('No form submission found'))
    }

    debug('Received xml submission')

    options = extend(defaults, options)

    options.meta = extend(options.meta, {
      deviceId: req.query.deviceID,
      submissionTime: new Date()
    })

    xform2json(req.body, options, function (err, form) {
      if (err) return next(err)
      var meta = options.geojson ? form.properties.meta : form.meta

      req.submission = {
        json: form,
        geojson: options.geojson,
        xml: req.body,
        formId: meta.formId,
        instanceId: meta.instanceId.replace(/^uuid:/, '')
      }

      debug('Processed xml submission as json in %s ms', Date.now() - t0)
      next()
    })
  }
}

module.exports = ProcessSubmission

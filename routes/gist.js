var router = require('express').Router({ mergeParams: true })
var FormSubmissionMiddleware = require('openrosa-form-submission-middleware')
var OpenRosaHeaders = require('openrosa-request-middleware')

var GithubAuth = require('../middlewares/github-auth-passthrough')
var ProcessSubmission = require('../middlewares/process-submission')
var SaveMedia = require('../middlewares/save-media')
var addS3bucket = require('../middlewares/s3')

var saveForm = require('../controllers/gist/save-form-gist')
var getForm = require('../controllers/gist/get-form-gist')
var getFormlist = require('../controllers/gist/get-formlist-gist')

router.use(GithubAuth())

router.route('/forms')
  .get(getForm)

router.route('/formList')
  .all(OpenRosaHeaders())
  .get(getFormlist)

router.route('/submission')
  .all(FormSubmissionMiddleware())
  .post(ProcessSubmission())
  .post(addS3bucket)
  .post(SaveMedia())
  .post(saveForm)

module.exports = router

import {expect, test} from '@oclif/test'
import cli from 'cli-ux'

describe('jobs:remove', () => {
  test
  .nock('https://api.heroku.com', api => api
    .get('/apps/example/config-vars')
    .reply(200, {})
  )
  .stdout()
  .command([
    'jobs:remove',
    '1',
    '--app', 'example',
  ])
  .exit(101)
  .it('exits with code 101 when config var SCHEDULERCTL_API_TOKEN not set')

  test
  .stub(cli, 'action.start', () => async () => 'Removing Heroku Scheduler job')
  .nock('https://api.heroku.com', api => api
    .get('/apps/example/config-vars')
    .reply(200, {SCHEDULERCTL_API_TOKEN: 'api-token'})
  )
  .nock('https://api.schedulerctl.com', api => api
    .delete('/jobs/1')
    .reply(404, {message: 'Heroku Scheduler not found. Install add-on via https://elements.heroku.com/addons/scheduler.'})
  )
  .stdout()
  .command([
    'jobs:remove',
    '1',
    '--app', 'example',
  ])
  .exit(102)
  .it('exits with code 102 on Heroku Scheduler not found error')

  test
  .stub(cli, 'action.start', () => async () => 'Removing Heroku Scheduler job')
  .nock('https://api.heroku.com', api => api
    .get('/apps/example/config-vars')
    .reply(200, {SCHEDULERCTL_API_TOKEN: 'api-token'})
  )
  .nock('https://api.schedulerctl.com', api => api
    .delete('/jobs/1')
    .reply(404, {message: 'Heroku Scheduler job not found.'})
  )
  .stdout()
  .command([
    'jobs:remove',
    '1',
    '--app', 'example',
  ])
  .exit(105)
  .it('exits with code 105 on Heroku Scheduler Job not found error')

  test
  .stub(cli, 'action.start', () => async () => 'Removing Heroku Scheduler job')
  .nock('https://api.heroku.com', api => api
    .get('/apps/example/config-vars')
    .reply(200, {SCHEDULERCTL_API_TOKEN: 'api-token'})
  )
  .nock('https://api.schedulerctl.com', api => api
    .delete('/jobs/1')
    .reply(403, {message: 'Forbidden.'})
  )
  .stdout()
  .command([
    'jobs:remove',
    '1',
    '--app', 'example',
  ])
  .exit(103)
  .it('exits with code 103 on authorization error')

  test
  .stub(cli, 'action.start', () => async () => 'Removing Heroku Scheduler job')
  .nock('https://api.heroku.com', api => api
    .get('/apps/example/config-vars')
    .reply(200, {SCHEDULERCTL_API_TOKEN: 'api-token'})
  )
  .nock('https://api.schedulerctl.com', api => api
    .delete('/jobs/1')
    .reply(500, {message: 'Server Error.'})
  )
  .stdout()
  .command([
    'jobs:remove',
    '1',
    '--app', 'example',
  ])
  .exit(106)
  .it('exits with code 106 on server error')

  test
  .stub(cli, 'action.start', () => async () => 'Removing Heroku Scheduler job')
  .nock('https://api.heroku.com', api => api
    .get('/apps/example/config-vars')
    .reply(200, {SCHEDULERCTL_API_TOKEN: 'api-token'})
  )
  .nock('https://api.schedulerctl.com', api => api
    .delete('/jobs/1')
    .reply(400)
  )
  .stdout()
  .command([
    'jobs:remove',
    '1',
    '--app', 'example',
  ])
  .exit(199)
  .it('exits with code 199 on unknown error')
})

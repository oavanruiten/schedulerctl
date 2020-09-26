import {expect, test} from '@oclif/test'
import cli from 'cli-ux'

describe('jobs:update', () => {
  test
  .stub(cli, 'action.start', () => async () => 'Updating Heroku Scheduler job')
  .nock('https://api.heroku.com', api => api
    .get('/apps/example/config-vars')
    .reply(200, {SCHEDULERCTL_API_TOKEN: 'api-token'})
  )
  .nock('https://api.schedulerctl.com', api => api
    .put('/jobs/1', body => body.command && body.frequency && body.dynoSize)
    .reply(200, {message: 'Heroku Scheduler job updated.', job: { id: '1', command: 'pwd', frequency: '*/10 * * * *', dynoSize: 'Free'}})
  )
  .stdout()
  .command([
    'jobs:update',
    '1',
    '--app', 'example',
    '--command', 'pwd',
    '--frequency', '*/10 * * * *',
    '--dynoSize', 'Free',
  ])
  .it('succeeds')

  test
  .nock('https://api.heroku.com', api => api
    .get('/apps/example/config-vars')
    .reply(200, {})
  )
  .stdout()
  .command([
    'jobs:update',
    '1',
    '--app', 'example',
    '--command', 'pwd',
    '--frequency', '*/10 * * * *',
    '--dynoSize', 'Free',
  ])
  .exit(101)
  .it('exits with code 101 when config var SCHEDULERCTL_API_TOKEN not set')

  test
  .stdout()
  .command([
    'jobs:update',
    '1',
    '--app', 'example',
    '--command', 'pwd',
    '--frequency', '*/5 * * * *',
    '--dynoSize', 'Free',
  ])
  .exit(100)
  .it('exits with code 100 when provided frequency is invalid')

  test
  .stub(cli, 'action.start', () => async () => 'Updating Heroku Scheduler job')
  .nock('https://api.heroku.com', api => api
    .get('/apps/example/config-vars')
    .reply(200, {SCHEDULERCTL_API_TOKEN: 'api-token'})
  )
  .nock('https://api.schedulerctl.com', api => api
    .put('/jobs/1', body => body.command && body.frequency && body.dynoSize)
    .reply(403, {message: 'Forbidden.'})
  )
  .stdout()
  .command([
    'jobs:update',
    '1',
    '--app', 'example',
    '--command', 'pwd',
    '--frequency', '*/10 * * * *',
    '--dynoSize', 'Free',
  ])
  .exit(103)
  .it('exits with code 103 on authorization error')

  test
  .stub(cli, 'action.start', () => async () => 'Updating Heroku Scheduler job')
  .nock('https://api.heroku.com', api => api
    .get('/apps/example/config-vars')
    .reply(200, {SCHEDULERCTL_API_TOKEN: 'api-token'})
  )
  .nock('https://api.schedulerctl.com', api => api
    .put('/jobs/1', body => body.command && body.frequency && body.dynoSize)
    .reply(404, {message: 'Heroku Scheduler not found. Install add-on via https://elements.heroku.com/addons/scheduler.'})
  )
  .stdout()
  .command([
    'jobs:update',
    '1',
    '--app', 'example',
    '--command', 'pwd',
    '--frequency', '*/10 * * * *',
    '--dynoSize', 'Free',
  ])
  .exit(102)
  .it('exits with code 102 on Heroku Scheduler not found error')

  test
  .stub(cli, 'action.start', () => async () => 'Updating Heroku Scheduler job')
  .nock('https://api.heroku.com', api => api
    .get('/apps/example/config-vars')
    .reply(200, {SCHEDULERCTL_API_TOKEN: 'api-token'})
  )
  .nock('https://api.schedulerctl.com', api => api
    .put('/jobs/1', body => body.command && body.frequency && body.dynoSize)
    .reply(404, {message: 'Heroku Scheduler job not found.'})
  )
  .stdout()
  .command([
    'jobs:update',
    '1',
    '--app', 'example',
    '--command', 'pwd',
    '--frequency', '*/10 * * * *',
    '--dynoSize', 'Free',
  ])
  .exit(105)
  .it('exits with code 105 on Heroku Scheduler Job not found error')

  test
  .stub(cli, 'action.start', () => async () => 'Updating Heroku Scheduler job')
  .nock('https://api.heroku.com', api => api
    .get('/apps/example/config-vars')
    .reply(200, {SCHEDULERCTL_API_TOKEN: 'api-token'})
  )
  .nock('https://api.schedulerctl.com', api => api
    .put('/jobs/1', body => body.command && body.frequency && body.dynoSize)
    .reply(422, {message: 'Error during validation. Check job attributes at https://documentation.schedulerctl.com/#job.'})
  )
  .stdout()
  .command([
    'jobs:update',
    '1',
    '--app', 'example',
    '--command', 'pwd',
    '--frequency', '*/10 * * * *',
    '--dynoSize', 'Free',
  ])
  .exit(104)
  .it('exits with code 104 on validation error')

  test
  .stub(cli, 'action.start', () => async () => 'Updating Heroku Scheduler job')
  .nock('https://api.heroku.com', api => api
    .get('/apps/example/config-vars')
    .reply(200, {SCHEDULERCTL_API_TOKEN: 'api-token'})
  )
  .nock('https://api.schedulerctl.com', api => api
    .put('/jobs/1', body => body.command && body.frequency && body.dynoSize)
    .reply(500, {message: 'Server Error.'})
  )
  .stdout()
  .command([
    'jobs:update',
    '1',
    '--app', 'example',
    '--command', 'pwd',
    '--frequency', '*/10 * * * *',
    '--dynoSize', 'Free',
  ])
  .exit(106)
  .it('exits with code 106 on server error')

  test
  .stub(cli, 'action.start', () => async () => 'Updating Heroku Scheduler job')
  .nock('https://api.heroku.com', api => api
    .get('/apps/example/config-vars')
    .reply(200, {SCHEDULERCTL_API_TOKEN: 'api-token'})
  )
  .nock('https://api.schedulerctl.com', api => api
    .put('/jobs/1', body => body.command && body.frequency && body.dynoSize)
    .reply(200)
  )
  .stdout()
  .command([
    'jobs:update',
    '1',
    '--app', 'example',
    '--command', 'pwd',
    '--frequency', '*/10 * * * *',
    '--dynoSize', 'Free',
  ])
  .exit(199)
  .it('exits with code 199 on unknown error')
})

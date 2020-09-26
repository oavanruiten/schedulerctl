import {expect, test} from '@oclif/test'

describe('jobs', () => {
  test
  .nock('https://api.heroku.com', api => api
    .get('/apps/example/config-vars')
    .reply(200, {SCHEDULERCTL_API_TOKEN: 'api-token'})
  )
  .nock('https://api.schedulerctl.com', api => api
    .get('/jobs')
    .reply(200, {message: '1 Heroku Scheduler job found.', jobs: [{ id: '1', command: 'pwd', dynoSize: 'Free', frequency: '0 * * * *'}]})
  )
  .stdout()
  .command([
    'jobs',
    '--app', 'example',
  ])
  .it('writes job data to stdout', ctx => {
    expect(ctx.stdout).to.contain('id')
    expect(ctx.stdout).to.contain('1')
    expect(ctx.stdout).to.contain('command')
    expect(ctx.stdout).to.contain('pwd')
    expect(ctx.stdout).to.contain('dyno size')
    expect(ctx.stdout).to.contain('Free')
    expect(ctx.stdout).to.contain('frequency')
    expect(ctx.stdout).to.contain('0 * * * *')
  })

  test
  .nock('https://api.heroku.com', api => api
    .get('/apps/example/config-vars')
    .reply(200, {SCHEDULERCTL_API_TOKEN: 'api-token'})
  )
  .nock('https://api.schedulerctl.com', api => api
    .get('/jobs')
    .reply(200, {message: '0 Heroku Scheduler jobs found.', jobs: []})
  )
  .stdout()
  .command([
    'jobs',
    '--app', 'example',
  ])
  .it('writes "0 Heroku Scheduler jobs found." to stdout', ctx => {
    expect(ctx.stdout).to.contain('0 Heroku Scheduler jobs found.')
  })

  test
  .nock('https://api.heroku.com', api => api
    .get('/apps/example/config-vars')
    .reply(200, {})
  )
  .stdout()
  .command([
    'jobs',
    '--app', 'example',
  ])
  .exit(101)
  .it('exits with code 101 when config var SCHEDULERCTL_API_TOKEN not set')

  test
  .nock('https://api.heroku.com', api => api
    .get('/apps/example/config-vars')
    .reply(200, {SCHEDULERCTL_API_TOKEN: 'api-token'})
  )
  .nock('https://api.schedulerctl.com', api => api
    .get('/jobs')
    .reply(200)
  )
  .stdout()
  .command([
    'jobs',
    '--app', 'example',
  ])
  .exit(199)
  .it('exits with code 199 on unknown error')

  test
  .nock('https://api.heroku.com', api => api
    .get('/apps/example/config-vars')
    .reply(200, {SCHEDULERCTL_API_TOKEN: 'api-token'})
  )
  .nock('https://api.schedulerctl.com', api => api
    .get('/jobs')
    .reply(403, {message: 'Forbidden.'})
  )
  .stdout()
  .command([
    'jobs',
    '--app', 'example',
  ])
  .exit(103)
  .it('exits with code 103 on authorization error')

  test
  .nock('https://api.heroku.com', api => api
    .get('/apps/example/config-vars')
    .reply(200, {SCHEDULERCTL_API_TOKEN: 'api-token'})
  )
  .nock('https://api.schedulerctl.com', api => api
    .get('/jobs')
    .reply(404, {message: 'Heroku Scheduler not found. Install add-on via https://elements.heroku.com/addons/scheduler.'})
  )
  .stdout()
  .command([
    'jobs',
    '--app', 'example',
  ])
  .exit(102)
  .it('exits with code 102 on Heroku Scheduler not found error')

  test
  .nock('https://api.heroku.com', api => api
    .get('/apps/example/config-vars')
    .reply(200, {SCHEDULERCTL_API_TOKEN: 'api-token'})
  )
  .nock('https://api.schedulerctl.com', api => api
    .get('/jobs')
    .reply(500, {message: 'Server Error.'})
  )
  .stdout()
  .command([
    'jobs',
    '--app', 'example',
  ])
  .exit(106)
  .it('exits with code 106 on server error')
})

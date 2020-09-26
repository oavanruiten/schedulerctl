import {Command, flags} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'

import {HTTP} from 'http-call'

const util: any = require('heroku-cli-util')

import { Job } from '../misc'

export default class Jobs extends Command {
  static description = 'list the Heroku Scheduler jobs of an app'
  static flags = {
    app: flags.app({required: true})
  }
  static examples = [
    '$ heroku jobs -a example',
  ]

  async run () {
    const {flags} = this.parse(Jobs)
    const response = await this.heroku.get<Heroku.App>(`/apps/${flags.app}/config-vars`)

    const SCHEDULERCTL_API_TOKEN = response.body.SCHEDULERCTL_API_TOKEN;

    if (!SCHEDULERCTL_API_TOKEN)
      this.error('Config var SCHEDULERCTL_API_TOKEN not set, make sure to install add-on via https://elements.heroku.com/addons/schedulerctl.', {exit: 101})

    try {
      const {body} = await HTTP.get<{message: string, code: string, jobs: Job[]}>('https://api.schedulerctl.com/jobs', {headers: {authorization: `bearer ${SCHEDULERCTL_API_TOKEN}`}})
      if (body.jobs.length > 0) {
        util.table(body.jobs, {
          columns: [
            {key: 'id'},
            {key: 'command'},
            {key: 'frequency'},
            {key: 'dynoSize', label: 'dyno size'},
          ]
        });
      } else {
        this.log(body.message);
      }
    } catch (error) {
      const message = error.body && error.body.message ? error.body.message : error.message
      switch (message) {
        case 'Heroku Scheduler not found. Install add-on via https://elements.heroku.com/addons/scheduler.':
          this.error(message, { exit: 102 })
          break
        case 'Forbidden.':
          this.error(message, { exit: 103 })
          break
        case 'Server Error.':
          this.error(message, { exit: 106 })
          break
        default:
          this.error(message, { exit: 199 })
      }
    }
  }
}

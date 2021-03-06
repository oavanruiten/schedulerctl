import {Command, flags} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'
import color from '@heroku-cli/color'
import cli from 'cli-ux'

import {HTTP} from 'http-call'

import { Job, DYNO_SIZES, SUPPORTED_CRON_EXPRESSIONS } from '../../misc'

export default class JobsUpdate extends Command {
  static description = 'update a Heroku Scheduler job from an app'
  static args = [
    {
      name: 'id',
      required: true,
      description: 'id of the Heroku Scheduler job',
    }
  ]
  static flags = {
    app: flags.app({required: true}),
    command: flags.string({
      char: 'c',
      description: 'command to execute',
      required: true
    }),
    frequency: flags.string({
      char: 'f',
      description: 'frequency to use',
      required: true,
    }),
    dynoSize: flags.string({
      char: 'd',
      description: 'dyno size to use',
      required: true,
      options: DYNO_SIZES
    }),
  }
  static examples = [
    '$ heroku jobs:update 1 -a example -c "sleep 60" -f "*/10 * * *" -d Standard-1X',
    '$ heroku jobs:update 1 -a example -c "sleep 60" -f "50 * * * *" -d Standard-1X',
    '$ heroku jobs:update 1 -a example -c "sleep 60" -f "30 10 * * *" -d Standard-1X',
  ]

  async run () {
    const {flags, args} = this.parse(JobsUpdate)

    if (!SUPPORTED_CRON_EXPRESSIONS.includes(flags.frequency))
      this.error('Frequency not supported. Check supported cron expressions at https://documentation.schedulerctl.com/#supported-cron-expressions.', {exit: 100})

    const response = await this.heroku.get<Heroku.App>(`/apps/${flags.app}/config-vars`)

    const SCHEDULERCTL_API_TOKEN = response.body.SCHEDULERCTL_API_TOKEN;

    if (!SCHEDULERCTL_API_TOKEN)
      this.error('Config var SCHEDULERCTL_API_TOKEN not set, make sure to install add-on via https://elements.heroku.com/addons/schedulerctl.', {exit: 101})

    cli.action.start('Updating Heroku Scheduler job')

    const options = {
      headers: {authorization: `bearer ${SCHEDULERCTL_API_TOKEN}`},
      body: {
        id: args.id,
        command: flags.command,
        dynoSize: flags.dynoSize,
        frequency: flags.frequency,
      },
    }

    try {
      const {body} = await HTTP.put<{message: string, code: string, job: Job}>(`https://api.schedulerctl.com/jobs/${args.id}`, options)

      cli.action.stop(`${color.green('done')}, updated job with id ${color.magenta(body.job.id)}`)
    } catch (error) {
      const message = error.body && error.body.message ? error.body.message : error.message

      switch (message) {
        case 'Heroku Scheduler not found. Install add-on via https://elements.heroku.com/addons/scheduler.':
          this.error(message, { exit: 102 })
          break
        case 'Forbidden.':
          this.error(message, { exit: 103 })
          break
        case 'Error during validation. Check job attributes at https://documentation.schedulerctl.com/#job.':
          this.error(message, { exit: 104 })
          break
        case 'Heroku Scheduler job not found.':
          this.error(message, { exit: 105 })
          break
        case 'Server Error.':
          this.error(message, { exit: 106 })
          break
        default:
          this.error(message, { exit: 199 })
      }
    }
  }

  async catch(error: Error) {
    cli.action.stop(`${color.red('!')}`)

    throw error
  }
}

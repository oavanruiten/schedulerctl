import {Command, flags} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'
import color from '@heroku-cli/color'
import cli from 'cli-ux'

import {HTTP} from 'http-call'

export default class JobsRemove extends Command {
  static description = 'permanently remove a Heroku Scheduler job from an app'
  static args = [
    {
      name: 'id',
      required: true,
      description: 'id of the Heroku Scheduler job',
    }
  ]
  static flags = {
    app: flags.app({required: true}),
  }
  static examples = [
    '$ heroku jobs:remove 1 -a example',
  ]

  async run () {
    const {flags, args} = this.parse(JobsRemove)
    const response = await this.heroku.get<Heroku.App>(`/apps/${flags.app}/config-vars`)

    const SCHEDULERCTL_API_TOKEN = response.body.SCHEDULERCTL_API_TOKEN;

    if (!SCHEDULERCTL_API_TOKEN)
      this.error('Config var SCHEDULERCTL_API_TOKEN not set, make sure to install add-on via https://elements.heroku.com/addons/schedulerctl.', {exit: 101})

    cli.action.start('Removing Heroku Scheduler job')

    const options = {
      headers: {authorization: `bearer ${SCHEDULERCTL_API_TOKEN}`},
    }

    try {
      const {body} = await HTTP.delete<{message: string, code: string}>(`https://api.schedulerctl.com/jobs/${args.id}`, options)

      cli.action.stop(`${color.green('done')}, removed job with id ${color.magenta(args.id)}`)
    } catch (error) {
      const message = error.body && error.body.message ? error.body.message : error.message

      switch (message) {
        case 'Heroku Scheduler not found. Install add-on via https://elements.heroku.com/addons/scheduler.':
          this.error(message, { exit: 102 })
          break
        case 'Forbidden.':
          this.error(message, { exit: 103 })
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

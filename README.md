schedulerctl
============

Heroku CLI plugin to create and manage Heroku Scheduler jobs of an Heroku application.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/schedulerctl.svg)](https://npmjs.org/package/schedulerctl)
[![Downloads/week](https://img.shields.io/npm/dw/schedulerctl.svg)](https://npmjs.org/package/schedulerctl)
[![License](https://img.shields.io/npm/l/schedulerctl.svg)](https://github.com/oavanruiten/schedulerctl/blob/master/package.json)

<!-- toc -->
* [Installation](#installation)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Installation
<!-- installation -->
```sh-session
$ heroku plugins:install schedulerctl
```
<!-- installationstop -->

# Usage
<!-- usage -->
```sh-session
$ heroku COMMAND
running command...
$ heroku --help [COMMAND]
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`heroku jobs`](#jobs)
* [`heroku jobs:add`](#jobsadd)
* [`heroku jobs:update [ID]`](#jobsupdate-id)
* [`heroku jobs:remove [ID]`](#jobsremove-id)

## `heroku jobs`

list the Heroku Scheduler jobs of an app

```
USAGE
  $ heroku jobs

OPTIONS
  -a, --app=app    (required) app to run command against
```

_See code: [src/commands/jobs.ts](https://github.com/oavanruiten/schedulerctl/blob/v1.0.1/src/commands/jobs.ts)_

## `heroku jobs:add`

add a new Heroku Scheduler job to an app

```
USAGE
  $ heroku jobs:add

OPTIONS
  -a, --app=app                                                                                                 (required) app to run command against
  -c, --command=command                                                                                         (required) command to execute
  -f, --frequency=frequency                                                                                     (required) frequency to use
  -d, --dynoSize==Free|Hobby|Standard-1X|Standard-2X|Performance-M|Performance-L|Private-S|Private-M|Private-L  (required) dyno size to use

EXAMPLE
  $ heroku jobs:add --app example --command "sleep 60" --frequency "0 0 * * *" --dynoSize Standard-1X
  Adding Heroku Scheduler job... done, added job with id 1
```

_See code: [src/commands/jobs/add.ts](https://github.com/oavanruiten/schedulerctl/blob/v1.0.1/src/commands/jobs/add.ts)_

## `heroku jobs:update [ID]`

update a Heroku Scheduler job from an app

```
USAGE
  $ heroku jobs:update [ID]
  
ARGUMENTS
  ID id of the Heroku Scheduler job

OPTIONS
  -a, --app=app                                                                                                 (required) app to run command against
  -c, --command=command                                                                                         (required) command to execute
  -f, --frequency=frequency                                                                                     (required) frequency to use
  -d, --dynoSize==Free|Hobby|Standard-1X|Standard-2X|Performance-M|Performance-L|Private-S|Private-M|Private-L  (required) dyno size to use

EXAMPLE
  $ heroku jobs:update 1 --app example --command "sleep 60" --frequency "50 * * * *" --dynoSize Standard-2X
  Updating Heroku Scheduler job... done, updated job with id 1
```

_See code: [src/commands/jobs/update.ts](https://github.com/oavanruiten/schedulerctl/blob/v1.0.1/src/commands/jobs/update.ts)_

## `heroku jobs:remove [ID]`

permanently remove a Heroku Scheduler job from an app

```
USAGE
  $ heroku jobs:remove [ID]
  
ARGUMENTS
  ID id of the Heroku Scheduler job

OPTIONS
  -a, --app=app    (required) app to run command against
  
EXAMPLE
  $ heroku jobs:remove 1 --app example
  Removing Heroku Scheduler job... done, removed job with id 1
```

_See code: [src/commands/jobs/remove.ts](https://github.com/oavanruiten/schedulerctl/blob/v1.0.1/src/commands/jobs/remove.ts)_
<!-- commandsstop -->

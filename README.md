# app-to-addon-migrator
![Build and Deploy](https://github.com/rajasegar/app-to-addon-migrator/workflows/Build%20and%20Deploy/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/rajasegar/app-to-addon-migrator/badge.svg?branch=master)](https://coveralls.io/github/rajasegar/app-to-addon-migrator?branch=master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![npm version](http://img.shields.io/npm/v/app-to-addon-migrator.svg?style=flat)](https://npmjs.org/package/app-to-addon-migrator "View this project on npm")

An opinionated cli tool to migrate Ember components from app to addons within a Yarn workspace.

*NOTE:* This cli tool works only with the following conventional folder structure for your Ember app.

```
|-app
|-packages
| |-addons
| |-engines
| | |-dashboards-engine
| | |-tickets-engine

```

## Assumptions made by this tool
- Your Ember app lives in the root of your project folder.
- Engines live under `packages/engines` folder.
- Addons live under `packages/addons` folder.
- You are using [Yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/).
- You are using [POD](https://cli.emberjs.com/release/advanced-use/project-layouts/#podslayout) structure for your components.

## Install
```
npm i -g app-to-addon-migrator
```

## Usage

### 1. ateam (wizard UI)
```
ateam
```

![ateam demo](render1590322152486.gif)

### 2. atam (classic CLI)
```
atam [entity] [entity-name] [dest-folder]
atam route default packages/engines/dashboards-engine
```

After running the above command, the route `default` from `app/routes/default.js` will be
moved to `packages/engines/dashboards-engine/addon/routes/default.js`

### Dry-run
If you just want to see/verify the movement use the `--dry-run` or `-d` option.

```
atam route default packages/engines/dashboards-engine -d
```

This will print something like (without actually copying the files):
```
Moving route.js
---------------
app/routes/helpdesk/default.js
packages/engines/dashboards-engine/addon/routes/default.js


Moving route template.hbs
-------------------------
app/templates/helpdeskdefault.hbs
packages/engines/dashboards-engine/addon/templates/default.hbs

...
```

### skip-tests
If you don't want to move the tests to the addon initially to avoid the overhead use the `--skip-tests` or `-st` option.

```
atam component ui-component/button-component packages/engines/dashboards-engine --skip-tests
```

This will move the tests from the original file structure to a new folder under the addon namespace
inside the host app test folder:

```
Moving component-test.js
-----------------------
app/tests/integration/components/ui-component/button-component/component-test.js
app/tests/packages/engines/dashboards-engine/tests/integration/components/ui-component/button-component-test.js

...
```
### Folder namespace
If your source entities are namespaced within a folder you can use the `-f` option to specify the same
before copying.
Say for example you want to move a component called `widget` from `app/components/dashboards`

```
atam component widget packages/engines/dashboards-engine -f dashboards
```

### Delete Source
If you just want to delete the source files after the movement use the `--delete-source` or `-ds` option.

```
atam route default packages/engines/dashboards-engine -ds
```

## Commands:
```
  atam adapter [adapter-name]               Copy an adapter from app to addon
  [destination]
  atam component [component-name]           Copy a component from app to addon
  [destination]
  atam constant [constant-name]             Copy a constant from app to addon
  [destination]
  atam helper [helper-name] [destination]   Copy a helper from app to addon
  atam mixin [mixin-name] [destination]     Copy a mixin from app to addon
  atam model [model-name] [destination]     Copy a model from app to addon
  atam route [route-name] [destination]     Copy a route with controller from
                                            app to addon
  atam routex [route-name] [destination]    Copy a route and its dependent
                                            components from app to addon
  atam service [storage-name]               Copy a storage from app to addon
  [destination]
  atam storage [storage-name]               Copy a storage from app to addon
  [destination]
  atam util [util-name] [destination]       Copy a util from app to addon
  atam validator [validator-name]           Copy a validator from app to addon
  [destination]

Options:
  --version      Show version number                                   [boolean]
  --help         Show help                                             [boolean]
  --dry-run, -d  Dry Run: Verify the movement without executing        [boolean]
  --pods, -p     Specify that the source components use PODS structure
                                                       [boolean] [default: true]
  --skip-tests, -st  Keep tests in host: Convert and keep the tests in the host app itself? (default: no)        [boolean] [default: false]


```

## References

- http://ember-engines.com/
- https://developer.squareup.com/blog/ember-and-yarn-workspaces/
- https://medium.com/@lukedeniston/how-to-write-a-really-really-ambitious-spa-in-2019-60fc38de89db
- https://github.com/lennyburdette/ember-monorepo-demo
- https://discuss.emberjs.com/t/yarn-workspaces-and-ember/15672/13
- https://github.com/habdelra/yarn-workface

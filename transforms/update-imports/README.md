# update-imports


## Usage

```
npx atam-codemod update-imports path/of/files/ or/some**/*glob.js

# or

yarn global add app-to-addon-migrator
atam-codemod update-imports path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [basic](#basic)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="basic">**basic**</a>

**Input** (<small>[basic.input.js](transforms/update-imports/__testfixtures__/basic.input.js)</small>):
```js
import Component from '@ember/component';
import { run } from '@ember/runloop';
import { set } from '@ember/object';
import TimeUtil from 'host-app-path/utils/time-util';

export default Component.extend({
  classNames: ['__page-layout__page-wrapper'],
  classNameBindings: ['sidebarEnabled:sidebar-present'],
  sidebarEnabled: false,
  contentSidebarEnabled: false,

  didRender() {
    this._super(...arguments);
    TimeUtil.getTime();
    this.interactivityTracking.trackOnce('FirstWrapperRender');
  },

  actions: {
    showHideSidebar(state) {
      run.next(() => {
        set(this, 'sidebarEnabled', state);
      });
    }
  }
});

```

**Output** (<small>[basic.output.js](transforms/update-imports/__testfixtures__/basic.output.js)</small>):
```js
import Component from '@ember/component';
import { run } from '@ember/runloop';
import { set } from '@ember/object';
import TimeUtil from '@company/common-addon/utils/time-util';

export default Component.extend({
  classNames: ['__page-layout__page-wrapper'],
  classNameBindings: ['sidebarEnabled:sidebar-present'],
  sidebarEnabled: false,
  contentSidebarEnabled: false,

  didRender() {
    this._super(...arguments);
    TimeUtil.getTime();
    this.interactivityTracking.trackOnce('FirstWrapperRender');
  },

  actions: {
    showHideSidebar(state) {
      run.next(() => {
        set(this, 'sidebarEnabled', state);
      });
    }
  }
});

```
<!--FIXTURES_CONTENT_END-->

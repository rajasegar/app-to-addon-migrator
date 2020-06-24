# add-layout-property


## Usage

```
npx atam-codemod add-layout-property path/of/files/ or/some**/*glob.js

# or

yarn global add app-to-addon-migrator
atam-codemod add-layout-property path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [basic](#basic)
* [import-exist-end](#import-exist-end)
* [import-property-exist](#import-property-exist)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="basic">**basic**</a>

**Input** (<small>[basic.input.js](transforms/add-layout-property/__testfixtures__/basic.input.js)</small>):
```js
import Component from '@ember/component';
import { run } from '@ember/runloop';
import { set } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['__page-layout__page-wrapper'],
  classNameBindings: ['sidebarEnabled:sidebar-present'],
  sidebarEnabled: false,
  contentSidebarEnabled: false,

  didRender() {
    this._super(...arguments);
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

**Output** (<small>[basic.output.js](transforms/add-layout-property/__testfixtures__/basic.output.js)</small>):
```js
import Component from '@ember/component';
import { run } from '@ember/runloop';
import { set } from '@ember/object';
import { inject as service } from '@ember/service';

import layout from '../../templates/components/file-name';

export default Component.extend({
  layout,
  classNames: ['__page-layout__page-wrapper'],
  classNameBindings: ['sidebarEnabled:sidebar-present'],
  sidebarEnabled: false,
  contentSidebarEnabled: false,

  didRender() {
    this._super(...arguments);
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
---
<a id="import-exist-end">**import-exist-end**</a>

**Input** (<small>[import-exist-end.input.js](transforms/add-layout-property/__testfixtures__/import-exist-end.input.js)</small>):
```js
import Component from '@ember/component';
import { run } from '@ember/runloop';
import { set } from '@ember/object';
import { inject as service } from '@ember/service';
import layout from './template';

export default Component.extend({
  classNames: ['__page-layout__page-wrapper'],
  classNameBindings: ['sidebarEnabled:sidebar-present'],
  sidebarEnabled: false,
  contentSidebarEnabled: false,

  didRender() {
    this._super(...arguments);
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

**Output** (<small>[import-exist-end.output.js](transforms/add-layout-property/__testfixtures__/import-exist-end.output.js)</small>):
```js
import Component from '@ember/component';
import { run } from '@ember/runloop';
import { set } from '@ember/object';
import { inject as service } from '@ember/service';
import layout from '../../templates/components/file-name';

export default Component.extend({
  layout,
  classNames: ['__page-layout__page-wrapper'],
  classNameBindings: ['sidebarEnabled:sidebar-present'],
  sidebarEnabled: false,
  contentSidebarEnabled: false,

  didRender() {
    this._super(...arguments);
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
---
<a id="import-property-exist">**import-property-exist**</a>

**Input** (<small>[import-property-exist.input.js](transforms/add-layout-property/__testfixtures__/import-property-exist.input.js)</small>):
```js
import Component from '@ember/component';
import { run } from '@ember/runloop';
import layout from './template';
import { set } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['__page-layout__page-wrapper'],
  layout: layout,
  classNameBindings: ['sidebarEnabled:sidebar-present'],
  sidebarEnabled: false,
  contentSidebarEnabled: false,

  didRender() {
    this._super(...arguments);
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

**Output** (<small>[import-property-exist.output.js](transforms/add-layout-property/__testfixtures__/import-property-exist.output.js)</small>):
```js
import Component from '@ember/component';
import { run } from '@ember/runloop';
import { set } from '@ember/object';
import { inject as service } from '@ember/service';
import layout from '../../templates/components/file-name';

export default Component.extend({
  layout,
  classNames: ['__page-layout__page-wrapper'],
  classNameBindings: ['sidebarEnabled:sidebar-present'],
  sidebarEnabled: false,
  contentSidebarEnabled: false,

  didRender() {
    this._super(...arguments);
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

import Component from '@ember/component';
import { run } from '@ember/runloop';
import { set } from '@ember/object';
import someMixin from 'path/of/mixin';

import layout from '../../templates/components/file-name';

export default Component.extend(someMixin, {
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

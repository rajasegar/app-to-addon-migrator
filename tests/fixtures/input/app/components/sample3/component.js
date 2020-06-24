import Component from '@ember/component';
import layout from 'some_path';
import { run } from '@ember/runloop';
import { set } from '@ember/object';

export default Component.extend({
  classNames: ['page-wrapper'],
  layout: layout,
  classNameBindings: ['sidebarEnabled:sidebar-present'],
  sidebarEnabled: false,
  contentSidebarEnabled: false,

  didRender() {
    this._super(...arguments);
  },

  actions: {
    showHideSidebar(state) {
      run.next(() => {
        set(this, 'sidebarEnabled', state);
      });
    }
  }
});

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

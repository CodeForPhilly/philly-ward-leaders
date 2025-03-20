import { config } from '@vue/test-utils';

config.global.stubs = {
  'router-link': {
    template: '<a><slot /></a>'
  },
  'router-view': {
    template: '<div><slot /></div>'
  }
};

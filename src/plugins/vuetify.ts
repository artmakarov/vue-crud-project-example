import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import * as labsComponents from 'vuetify/labs/components';
import 'vuetify/styles';

export const vuetify = createVuetify({
  directives,
  components: {
    ...components,
    ...labsComponents,
  },
  theme: {
    defaultTheme: 'light',
  },
});

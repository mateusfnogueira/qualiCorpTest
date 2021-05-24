'use strict';

import Vue from 'vue';
import axios from 'axios';

Vue.use({
  install(Vue) {
    Vue.prototype.$http = axios.create({
      baseURL: 'https://lb-aws-1105894158.sa-east-1.elb.amazonaws.com/',
    });
  },
});

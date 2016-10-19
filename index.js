/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-wistia',
  contentFor: function(type, config){
    if (type === 'head'){
      return '';
    } else if (type === 'head-footer'){
      return '';
    } else if (type === 'body'){
      return '';
    } else if (type === 'body-footer'){
      if (config.environment === 'test') {
        return '';
      } else {
        return '<script src="https://fast.wistia.com/assets/external/E-v1.js"></script>';
      }
    }
  }
};

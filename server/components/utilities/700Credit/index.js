'use strict';

import request from 'request-promise';
import xml2js from 'xml2js';
import _ from 'lodash';

export function getCreditScore(req) {
  let parser = new xml2js.Parser();
  let params = req.query;
  let appSetting = global.applicationSettings;
  let url = appSetting.credit700.baseUrl.concat('?ACCOUNT=').concat(appSetting.credit700.account).concat('&PASSWD=').concat(appSetting.credit700.password);
  _.forOwn(params, function (value, key) {
    if (value) {
      url = url.concat('&').concat(key).concat('=').concat(value);
    }
  });

  return new Promise(function (resolve, reject) {
    return request(url).then(getCredit).catch(onError);
    
    function getCredit(xml) {
      return parser.parseString(xml, function (err, result) {
        return resolve(result);
      });
    }

    function onError(err) {
      return reject(err);
    }
  });
}

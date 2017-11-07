'use strict'
/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
const AWS = require('aws-sdk');
 
exports.handler = (event, context, callback) => {
  const version = event.version;
  if (!version) {
    callback('Version is required');
  }

  const nightly = /^\d{4}(\.\d{2}){2}$/.exec(version);
  const path = nightly
    ? 'source/nightlies/hhvm-nightly-'+version+'.tar.gz'
    : 'source/hhvm-'+version+'.tar.gz';

  const params = {
    Bucket: 'hhvm-downloads',
    Key: path
  };
  const s3 = new AWS.S3();
  s3.headObject(params, function(err, data) {
    if (err) {
      callback(err, params);
    }
    callback(null, {version: version, params: params});
  });
}
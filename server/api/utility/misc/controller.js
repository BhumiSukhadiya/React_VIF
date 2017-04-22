'use strict';

import constants from '../../../config/constants';

export function getConstants(req, res) {
  return res.status(200).json(constants);
}

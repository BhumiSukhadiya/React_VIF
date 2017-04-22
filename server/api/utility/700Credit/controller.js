'use strict';

import * as creditScore from '../../../components/utilities/700Credit';

export function getCreditScore(req, res) {
  return creditScore.getCreditScore(req)
    .then(data => {
      return res.status(200).send(data);
    })
    .catch(error => res.status(500).json(error));
}

'use strict';

import * as nada from '../../../components/utilities/NADA';

export function getNada(req, res) {
  let nadaRes = nada.getDetail();
  return res.status(200).json({message: 'index called. '.concat(nadaRes.message)});
}

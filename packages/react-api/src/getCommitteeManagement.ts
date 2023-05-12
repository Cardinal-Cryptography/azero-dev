import type { ApiPromise } from '@polkadot/api';
import type { ApiDecoration } from '@polkadot/api/types';

export default function getCommitteeManagement (api: ApiPromise | ApiDecoration<'promise'>) {
  return {
    consts: api.consts.committeeManagement || api.consts.elections,
    query: api.query.committeeManagement || api.query.elections
  };
}

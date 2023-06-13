// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

export default {
  rpc: {
    alephNode: {
      emergencyFinalize: {
        description: 'Finalize the block with given hash and number using attached signature. Returns the empty string or an error.',
        params: [
          {
            name: 'justification',
            type: 'Bytes'
          },
          {
            name: 'hash',
            type: 'BlockHash'
          },
          {
            name: 'number',
            type: 'BlockNumber'
          }
        ],
        type: 'Null'
      },
      getBlockAuthor: {
        description: 'Get the author of the block with given hash.',
        params: [
          {
            name: 'hash',
            type: 'BlockHash'
          }
        ],
        type: 'Option<AccountId>'
      }
    }
  },
  types: [
    {
      // supported on all versions
      minmax: [0, undefined],
      types: {
        ApiError: {
          '_enum': ['DecodeKey']
        },
        SessionAuthorityData: {
          authorities: 'Vec<AuthorityId>',
          emergency_finalizer: 'Option<AuthorityId>',
        },
        Version: 'u32'
      }
    }
  ],
  runtime: {
    AlephSessionApi: [
      {
        version: 1,
        methods: {
          next_session_authorities: {
            params: [],
            type: 'Result<Vec<AuthorityId>, ApiError>'
          },
          authorities: {
            params: [],
            type: 'Vec<AuthorityId>'
          },
          next_session_authority_data: {
            params: [],
            type: 'Result<SessionAuthorityData, ApiError>'
          },
          authority_data: {
            params: [],
            type: 'SessionAuthorityData'
          },
          session_period: {
            params: [],
            type: 'u32'
          },
          millisecs_per_block: {
            params: [],
            type: 'u64'
          },
          finality_version: {
            params: [],
            type: 'Version'
          },
          next_session_finality_version: {
            params: [],
            type: 'Version'
          },
        }
      }
    ]
  }
};

import React from 'react';

import { useAlephBFTCommittee } from '@polkadot/react-hooks';

type Props = {
  session: number;
};

const AlephBFTCommitteeList = ({ session }: Props) => {
  const committee = useAlephBFTCommittee(session);

  return (
    <>{committee}</>
  );
};

export default AlephBFTCommitteeList;

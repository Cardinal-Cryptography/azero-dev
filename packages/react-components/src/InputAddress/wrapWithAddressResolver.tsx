import { resolveAddressToDomain } from '@azns/resolver-core';
import React, { ComponentType, useContext, useEffect, useState } from 'react';

import { ApiCtx } from '@polkadot/react-api';
import { systemNameToChainId } from '@polkadot/react-hooks';

type ExpectedProps = {
  options: {value: string | undefined}[];
  optionsAll: Record<string, {value: string | undefined}[]>;
};

type RequiredProps = ExpectedProps & {
  addressToDomain: Record<string, string | null | undefined>;
};

type ResolvedAddressesWrapperFactoryType = <
  WrappedComponentProps extends RequiredProps
>(Component: ComponentType<WrappedComponentProps>, props: WrappedComponentProps) => React.ReactElement | null;

type WrapWithAddressResolver = <
  WrappedComponentProps extends RequiredProps
>(Component: ComponentType<WrappedComponentProps>) => (props: WrappedComponentProps) => React.ReactElement | null;

const ResolvedAddressesWrapperFactory: ResolvedAddressesWrapperFactoryType = (Component, props) => {
  const [addressToDomain, setAddressToDomain] = useState({});
  const { api, systemChain } = useContext(ApiCtx);

  const { options, optionsAll } = props;

  useEffect(() => {
    const chainId = systemNameToChainId.get(systemChain);

    if (!chainId) {
      return;
    }

    const allAddressesWithDuplicates = [...(options || []), ...(optionsAll?.allPlus || [])].flatMap(({ value }) => value ? [value] : []);
    const allAddresses = [...new Set(allAddressesWithDuplicates)];

    const unresolvedAddresses = allAddresses.filter((address) => !(address in addressToDomain));
    const domainPromises = unresolvedAddresses.map((address) => resolveAddressToDomain(address, { chainId, customApi: api }));

    if (!domainPromises.length) {
      return;
    }

    Promise.all(domainPromises).then(
      (results) => {
        const addressDomainTuples = results.flatMap(({ error, primaryDomain }, index) => error ? [] : [[unresolvedAddresses[index], primaryDomain] as [string, string | undefined | null]]);

        setAddressToDomain({ ...addressToDomain, ...Object.fromEntries(addressDomainTuples) });
      }
    ).catch(console.error);
  });

  return (
    <Component
      {...props}
      addressToDomain={addressToDomain}
    />
  );
};

const wrapWithAddressResolver: WrapWithAddressResolver = (Component) => (props) => ResolvedAddressesWrapperFactory(Component, props);

export default wrapWithAddressResolver;

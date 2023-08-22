import type { ApiPromise } from '@polkadot/api';

import { SupportedChainId } from '@azns/resolver-core';
import { useResolveAddressToDomain } from '@azns/resolver-react';
import React, { useId } from 'react';

import { externalAzeroIdLogoBlackSVG, externalAzeroIdLogoPrimarySVG } from '@polkadot/apps-config/ui/logos/external';
import { useApi, useTheme } from '@polkadot/react-hooks';

import { styled } from '../styled.js';
import Tooltip from '../Tooltip.js';
import { useTranslation } from '../translate.js';

type WrappedAzeroIdProps = {
  address?: string;
  className?: string;
};

type AzeroIdProps = WrappedAzeroIdProps & {
  api: ApiPromise;
  chainId: SupportedChainId.AlephZero | SupportedChainId.AlephZeroTestnet,
};

const systemNameToChainId: Map<string, SupportedChainId.AlephZero | SupportedChainId.AlephZeroTestnet> = new Map([
  ['Aleph Zero', SupportedChainId.AlephZero],
  ['Aleph Zero Testnet', SupportedChainId.AlephZeroTestnet]
]);

const AzeroId = ({ address, api, chainId, className }: AzeroIdProps) => {
  const theme = useTheme();
  const tooltipId = useId();
  const { t } = useTranslation();

  const { hasError, primaryDomain } = useResolveAddressToDomain(address, { chainId, customApi: api });

  if (primaryDomain === undefined || hasError) {
    return <Placeholder className={`--tmp ${className || ''}`} />;
  }

  if (!primaryDomain) {
    return (
      <Container className={className}>
        <StyledLink
          href='https://azero.id/'
          rel='noreferrer'
          target='_blank'
        >
          {t('Register on-chain domain')}
          <Logo
            data-for={tooltipId}
            data-tip={true}
            src={theme.theme === 'dark' ? externalAzeroIdLogoPrimarySVG : externalAzeroIdLogoBlackSVG}
          />
        </StyledLink>
      </Container>
    );
  }

  const href = {
    [SupportedChainId.AlephZero]: `https://azero.id/id/${primaryDomain}`,
    [SupportedChainId.AlephZeroTestnet]: `https://tzero.id/id/${primaryDomain}`
  }[chainId];

  return (
    <Container
      className={className}
    >
      <span>{primaryDomain}</span>
      <StyledLink
        href={href}
        rel='noreferrer'
        target='_blank'
      >
        <Logo
          data-for={tooltipId}
          data-tip={true}
          src={theme.theme === 'dark' ? externalAzeroIdLogoPrimarySVG : externalAzeroIdLogoBlackSVG}
        />
        <Tooltip
          className='accounts-badge'
          text={<div>{t('AZERO.ID Primary Domain')}</div>}
          trigger={tooltipId}
        />
      </StyledLink>
    </Container>
  );
};

const WrappedAzeroId = ({ address, className }: WrappedAzeroIdProps) => {
  const { api, systemChain } = useApi();

  const chainId = systemNameToChainId.get(systemChain);

  if (!chainId) {
    return null;
  }

  return (
    <AzeroId
      address={address}
      api={api}
      chainId={chainId}
      className={className}
    />
  );
};

const Placeholder = styled.p`
  width: 160px;
  height: 18px;
`;

const Container = styled.p`
  display: flex;
  align-items: center;
  font-size: 12px;
`;

const StyledLink = styled.a`
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  width: 18px;
  height: 18px;
  margin-left: 5px;
`;

export default WrappedAzeroId;

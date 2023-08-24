import type { ApiPromise } from '@polkadot/api';

import { SupportedChainId } from '@azns/resolver-core';
import { useResolveAddressToDomain } from '@azns/resolver-react';
import React, { useCallback, useId } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import { externalAzeroIdLogoBlackSVG, externalAzeroIdLogoGreySVG, externalAzeroIdLogoPrimarySVG } from '@polkadot/apps-config/ui/logos/external';
import { useApi, useQueue, useTheme } from '@polkadot/react-hooks';

import Icon from './Icon.js';
import { styled } from './styled.js';
import Tooltip from './Tooltip.js';
import { useTranslation } from './translate.js';

type WrappedAzeroIdProps = {
  address?: string;
  className?: string;
  isRegisterLinkShown?: boolean;
};

type AzeroIdProps = WrappedAzeroIdProps & {
  api: ApiPromise;
  chainId: SupportedChainId.AlephZero | SupportedChainId.AlephZeroTestnet,
};

const systemNameToChainId: Map<string, SupportedChainId.AlephZero | SupportedChainId.AlephZeroTestnet> = new Map([
  ['Aleph Zero', SupportedChainId.AlephZero],
  ['Aleph Zero Testnet', SupportedChainId.AlephZeroTestnet]
]);

const AzeroId = ({ address, api, chainId, className, isRegisterLinkShown }: AzeroIdProps) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const { queueAction } = useQueue();

  const tooltipId = useId();

  const onCopy = useCallback(
    () => queueAction({
      action: t<string>('clipboard'),
      message: t<string>('domain copied'),
      status: 'queued'
    }),
    [queueAction, t]
  );

  const { hasError, isLoading, primaryDomain } = useResolveAddressToDomain(address, { chainId, customApi: api });

  if (primaryDomain) {
    const href = {
      [SupportedChainId.AlephZero]: `https://azero.id/id/${primaryDomain}`,
      [SupportedChainId.AlephZeroTestnet]: `https://tzero.id/id/${primaryDomain}`
    }[chainId];

    return (
      <Container
        className={className}
      >
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
        <CopyToClipboard
          onCopy={onCopy}
          text={primaryDomain}
        >
          <UnstyledButton
            type='button'
          >
            <span>{primaryDomain}</span>
            <SmallIcon icon='copy' />
          </UnstyledButton>
        </CopyToClipboard>
      </Container>
    );
  }

  if (!isRegisterLinkShown) {
    return null;
  }

  if (isLoading || hasError) {
    return <Placeholder className={`--tmp ${className || ''}`} />;
  }

  return (
    <Container className={className}>
      <StyledLink
        href='https://azero.id/'
        rel='noreferrer'
        target='_blank'
      >
        <Logo
          data-for={tooltipId}
          data-tip={true}
          src={externalAzeroIdLogoGreySVG}
        />
        {t('Register on-chain domain')}
      </StyledLink>
    </Container>
  );
};

const WrappedAzeroId = ({ address, className, isRegisterLinkShown = true }: WrappedAzeroIdProps) => {
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
      isRegisterLinkShown={isRegisterLinkShown}
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

  margin: 0;

  color: #8B8B8B;
  font-size: var(--font-size-small);
`;

const StyledLink = styled.a`
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  width: 18px;
  height: 18px;
  margin-right: 5px;
`;

const UnstyledButton = styled.button`
  background-color: inherit;
  color: inherit;
  padding: 0;
  border: unset;

  cursor: copy;
`;

const SmallIcon = styled(Icon)`
  width: 10px;
  height: 10px;

  margin-left: 5px;
`;

export default WrappedAzeroId;

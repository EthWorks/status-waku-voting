import styled from 'styled-components'

export const Button = styled.button`
  height: 44px;
  border-radius: 8px;
  font-size: 15px;
  border: 0px;
  outline: none;
`

export const SmallButton = styled(Button)`
  width: 187px;
  background-color: #fff7ed;
  color: #a53607;
  font-weight: 500;
  font-size: 15px;
  line-height: 22px;
  transition: all 0.3s;

  &:not(:disabled):hover {
    background: #ffe4db;
  }

  &:not(:disabled):active {
    background: #fffcf7;
  }

  &:disabled {
    background: #f3f3f3;
    color: #939ba1;
  }
`

interface ConnectButtonProps {
  color: string
}

export const ConnectButton = styled(Button)<ConnectButtonProps>`
  padding: 10px 28px;
  background-color: ${({ color }) => color || '#ffb571'};
  color: #ffffff;
  font-weight: bold;
  line-height: 24px;

  &:not(:disabled):hover {
    background: #a53607;
  }

  &:not(:disabled):active {
    background: #f4b77e;
  }

  &:disabled {
    background: #888888;
    filter: grayscale(1);
  }

  @media (max-width: 600px) {
    padding: 3px 28px;
  }
`
export const Account = styled.button<ConnectButtonProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #ffffff;
  border: 1px solid #eef2f5;
  box-sizing: border-box;
  border-radius: 21px;
  padding: 11px 12px 11px 17px;
  font-weight: 500;
  font-size: 13px;
  line-height: 22px;

  &:hover {
    border: 1px solid ${({ color }) => color || '#ffb571'};
  }
`

export const ButtonDisconnect = styled.button`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  font-weight: 500;
  font-size: 15px;
  line-height: 22px;
  text-align: center;
  padding: 15px 32px;
  color: #a53607;
  background: #ffffff;
  border: 1px solid #eef2f5;
  border-radius: 16px 4px 16px 16px;
  box-shadow: 0px 2px 16px rgba(0, 9, 26, 0.12);
  transition: all 0.3s;
  outline: none;

  &:hover {
    background: #a53607;
    color: #ffffff;
  }

  &:active {
    background: #f4b77e;
    color: #ffffff;
  }

  &.opened {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    z-index: 10;
  }
`

import { atom } from 'recoil';

export const socketState = atom<WebSocket | null>({
    key: 'socketState',
    default: null,
});

export const playerState = atom<string>({
    key: 'playerState',
    default: 'E',
});

export const codeState = atom<string>({
    key: 'codeState',
    default: '',
});

export const moneyState = atom<boolean>({
    key: 'moneyState',
    default: false,
});

export const winnerState = atom<string | null>({
    key: 'winnerState',
    default: null,
});

export const publicKeyState = atom({
    key: "publicKeyState",
    default: "",
  });
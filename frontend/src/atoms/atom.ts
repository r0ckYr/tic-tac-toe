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

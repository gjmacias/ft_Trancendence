import Navigator from '@/Navigator';
import Logger from '@utils/Logger';

export const root = document.getElementById('root') as HTMLElement;
const sessionId = crypto.randomUUID();
sessionStorage.setItem('sessionId', sessionId);

Navigator.init();

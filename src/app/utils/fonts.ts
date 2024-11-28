import { Tomorrow } from 'next/font/google';
import { Anta } from 'next/font/google';
import { Saira } from 'next/font/google';

const tomorrow = Tomorrow({ weight: '500', subsets: ['latin'] });
const anta = Anta({ weight: '400', subsets: ['latin'] });
const saira = Saira({ weight: '500', subsets: ['latin'] });

export const primaryFont = saira.className || tomorrow.className || anta.className;
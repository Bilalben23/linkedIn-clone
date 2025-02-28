import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

// Initialize once to avoid multiple instances
TimeAgo.addDefaultLocale(en);
const timeAgoInstance = new TimeAgo('en-US');

export const timeAgo = (date) => timeAgoInstance.format(new Date(date), 'mini');

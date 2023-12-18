import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

export const relativeDate = (input: string | Date): string => {
	dayjs.extend(relativeTime);
	return dayjs(input).fromNow();
};

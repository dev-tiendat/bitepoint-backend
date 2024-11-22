import dayjs from 'dayjs';

export function convertToUnix(
    date: string | dayjs.Dayjs | Date | null | undefined = undefined
): number {
    return dayjs(date).unix();
}

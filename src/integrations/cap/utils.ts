import { CapHistoryLog, MappedCapHistoryLog } from '.';

const mapDetails = (details: CapHistoryLog['details']) => {
  return details.reduce((acc, [key, value]) => {
    const aux = Object.values(value)[0];
    acc[key] = typeof aux === 'bigint' ? Number(aux) : aux;
    return acc;
  }, {} as any);
};

export const parseCapHistoryLog = (
  data: CapHistoryLog[]
): MappedCapHistoryLog[] => {
  return data.map<MappedCapHistoryLog>((data) => {
    return {
      ...data,
      time: Number(data.time),
      details: mapDetails(data.details),
    };
  });
};

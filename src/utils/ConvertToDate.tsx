export const ConvertToDate = (epoch: number) => {
  const date = new Date(epoch * 1000);
  return date.toLocaleString();
};

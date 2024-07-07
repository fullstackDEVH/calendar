export const DATA_TIME = Array.from({ length: 28 }, (_, index) => {
  const hour = Math.floor(index / 2) + 9;
  const minutes = index % 2 === 0 ? "00" : "30";
  const label = `${hour}:${minutes}`;
  const value = `${hour}:${minutes}`;
  return { label, value };
});

export const DATE_FORMAT = "yyyy/MM/DD";

export const convertNumber = (value) => {
  return (isNaN(value))? 0: Number(value);
}
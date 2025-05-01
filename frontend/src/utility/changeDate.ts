  // format the date
export const changeDate = (date: string) => {
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
};

export const formatDateToLocalISO = (date: Date): string => {
  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2);
  const day = (`0${date.getDate()}`).slice(-2);
  return `${year}-${month}-${day}`;
};

export const formatTime = (date: string) => {
  const d = new Date(date);
  const hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

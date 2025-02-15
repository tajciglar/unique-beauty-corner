  // format the date
export const changeDate = (date: string) => {
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
};


// 01-jan-2026
export const formatDate = (dateInput: string | Date): string => {
  if (!dateInput) return "";

  const date = new Date(dateInput);

  const day = date.getDate();
  const year = date.getFullYear();

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const month = months[date.getMonth()];

  return `${day} ${month} ${year}`;
};

export const secondsToVerbose = (time: number | undefined) => {
  if (time == undefined)
    return '...'
  let verbose = '';
  const days = Math.floor(time / 86400);
  time -= days * 86400;
  const hours = Math.floor(time / 3600);
  time -= hours * 3600;
  const minutes = Math.floor(time / 60);
  time -= minutes * 60;

  if (days > 0)
    verbose += `${days}j `
  if (hours > 0) {
    if (hours < 10 && days > 0)
      verbose += '0';
    verbose += `${hours}h `
  }
  if (days == 0) {
    if (minutes < 10 && hours > 0)
      verbose += '0';
    verbose += `${minutes} min`
  }
  return verbose;
}

export const dateToText = (date: Date) => {
  const mm = date.getMonth();
  const day = date.getDay();
  const year = date.getFullYear();
  const hour = date.getHours();
  const minutes = date.getMinutes();

  const months = ["Janvier", 'Février', 'Mars', 'Avril', 'Mai',
    'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const res = `${day} ${months[mm]} ${year} à ${hour.toString().padStart(2, '0')}h${minutes.toString().padStart(2, '0')}`;
  return res;
}
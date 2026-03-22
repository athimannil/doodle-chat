const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return 'Invalid Date';

  return date
    .toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    .replace(',', '');
};

const decodeHtml = (html: string): string => {
  return (
    new DOMParser().parseFromString(html, 'text/html').body.textContent || ''
  );
};

export { formatTimestamp, decodeHtml };

export const exportToCSV = (data) => {
  const headers = ['Date', 'Time', 'Metric Type', 'Value', 'Unit'];
  const csvContent = [
    headers.join(','),
    ...data.map(item => [
      new Date(item.timestamp).toLocaleDateString(),
      new Date(item.timestamp).toLocaleTimeString(),
      item.type,
      item.value.toString(),
      item.unit
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `health-metrics-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
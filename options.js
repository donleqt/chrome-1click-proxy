document.getElementById('save').addEventListener('click', () => {
  const proxyHost = document.getElementById('proxyHost').value || '127.0.0.1';
  const proxyPort = document.getElementById('proxyPort').value || '1080';
  const proxyUrls = document
    .getElementById('proxyUrls')
    .value.split('\n')
    .map((url) => url.trim());

  chrome.storage.local.set({ proxyHost, proxyPort, proxyUrls }, () => {
    alert('Settings saved!');
  });
});

document.addEventListener('DOMContentLoaded', async () => {
  const config = await chrome.storage.local.get([
    'proxyHost',
    'proxyPort',
    'proxyUrls',
  ]);
  document.getElementById('proxyHost').value = config.proxyHost || '127.0.0.1';
  document.getElementById('proxyPort').value = config.proxyPort || '1080';
  document.getElementById('proxyUrls').value = (config.proxyUrls || []).join(
    '\n'
  );
});

async function connect() {
  // Retrieve proxy settings and applicable URLs from storage
  const config = await chrome.storage.local.get([
    'proxyHost',
    'proxyPort',
    'proxyUrls',
  ]);
  const host = config.proxyHost || '127.0.0.1';
  const port = config.proxyPort || 1080;
  const proxyUrls = config.proxyUrls || [];

  // Create a list of regex patterns for domains to match
  const regexPatterns = proxyUrls
    .filter((url) => url.trim() !== '')
    .map((url) => {
      try {
        const domain = new URL(url).hostname;
        return domain;
      } catch (error) {
        console.error('Invalid URL in proxyUrls:', url);
        return null;
      }
    })
    .filter((pattern) => pattern !== null);

  // Set the proxy rules
  chrome.proxy.settings.set(
    {
      value: {
        mode: 'pac_script',
        pacScript: {
          data: `
            function FindProxyForURL(url, host) {
              const proxyDomains = ${JSON.stringify(regexPatterns)};
              for (let i = 0; i < proxyDomains.length; i++) {
                if (host.endsWith(proxyDomains[i])) {
                  return "SOCKS5 ${host}:${port}";
                }
              }
              return "DIRECT";
            }
          `,
        },
      },
      scope: 'regular',
    },
    () => {
      console.log('SOCKS Proxy Enabled.');
      // Change the icon to enabled state
      chrome.action.setIcon({ path: 'icon-enabled.png' });
    }
  );
}

function disconnect() {
  // Disable the proxy settings
  chrome.proxy.settings.set(
    {
      value: { mode: 'direct' },
      scope: 'regular',
    },
    () => {
      console.log('SOCKS Proxy Disabled.');
      // Change the icon to disabled state
      chrome.action.setIcon({ path: 'icon.png' });
    }
  );
}

function getProxyStatus() {
  return new Promise((resolve) => {
    chrome.proxy.settings.get({ incognito: false }, (details) => {
      const isEnabled = details.value.mode === 'pac_script';
      resolve(isEnabled);
    });
  });
}

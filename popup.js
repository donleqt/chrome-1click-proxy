// Attach events
document.getElementById('toggle').addEventListener('click', async () => {
  const button = document.getElementById('toggle');
  const isEnabled = await getProxyStatus();

  if (isEnabled) {
    disconnect();
    setButtonStatus(button, false);
  } else {
    connect();
    setButtonStatus(button, true);
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  const button = document.getElementById('toggle');
  const isEnabled = await getProxyStatus();

  setButtonStatus(button, isEnabled);
});

function setButtonStatus(button, isEnabled) {
  if (isEnabled) {
    button.textContent = button.getAttribute('data-disable-label');
    button.classList.remove(
      ...button.getAttribute('data-enabled-class').split(' ')
    );
    button.classList.add(
      ...button.getAttribute('data-disabled-class').split(' ')
    );
  } else {
    button.textContent = button.getAttribute('data-enable-label');
    button.classList.remove(
      ...button.getAttribute('data-disabled-class').split(' ')
    );
    button.classList.add(
      ...button.getAttribute('data-enabled-class').split(' ')
    );
  }
}

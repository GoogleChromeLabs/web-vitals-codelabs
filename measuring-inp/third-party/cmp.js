const storageKey = 'cookies?';
const confirmValue = 'confirm';

function manuallyTemplateDialog() {
  const dialog = document.createElement('dialog');
  const form = document.createElement('form');
  form.setAttribute('method', 'dialog');
  dialog.append(form);

  const text = document.createElement('p');
  text.textContent = 'This site doesn\'t but totally could set cookies. Would you want those?';
  const cancel = document.createElement('button');
  cancel.setAttribute('value', 'cancel');
  cancel.textContent = 'No';
  const confirm = document.createElement('button');
  confirm.id = 'confirm';
  confirm.setAttribute('value', confirmValue);
  confirm.textContent = 'Yes, love those';

  form.append(text, cancel, '\n', confirm);

  return dialog;
}

function insertDialog() {
  const dialog = manuallyTemplateDialog();

  document.body.append(dialog);

  dialog.addEventListener('close', evt => {
    const dialogValue = evt.target?.returnValue;
    if (dialogValue) {
      localStorage.setItem(storageKey, dialogValue);
    }
  });

  const confirmButton = dialog.querySelector('#confirm');
  confirmButton.addEventListener('click', evt => {
    dataLayer.push({
      event: 'cookie-confirm',
    });
  });

  dialog.showModal();
}

function openDialogIfNeeded() {
  const cookieStatus = localStorage.getItem(storageKey);
  if (cookieStatus === null) {
    insertDialog();
  }
}

openDialogIfNeeded();

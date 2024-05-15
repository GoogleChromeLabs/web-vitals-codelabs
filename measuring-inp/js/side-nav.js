function sidenavSetup() {
  const sidenav = document.querySelector('#sidenav-open');

  // Set focus to our open/close buttons after animation.
  sidenav.addEventListener('transitionend', e => {
    if (e.propertyName !== 'transform') return;

    const isOpen = document.location.hash === '#sidenav-open';
    if (isOpen) {
      document.querySelector('#sidenav-close').focus();
    } else {
      document.querySelector('#sidenav-button').focus();
      history.replaceState(null, '', ' ');
    }
  });

  sidenav.addEventListener('transitionstart', e => {
    if (e.propertyName !== 'transform') return;

    const isOpen = document.location.hash === '#sidenav-open';
    if (!isOpen) {
      document.querySelector('main').inert = false;
    }
  });

  // Close our menu when esc is pressed
  sidenav.addEventListener('keyup', e => {
    if (e.code === 'Escape') document.location.hash = '';
  });

  const sidenavHamburger = document.querySelector('a#sidenav-button');
  sidenavHamburger.addEventListener('click', navOpen);
}

function navOpen() {
  const willOpen = document.location.hash !== '#sidenav-open';
  document.querySelector('main').inert = willOpen;

  requestAnimationFrame(() => {
    dataLayer.push({event: 'hamburger-menu'});
  });
}

export {
  sidenavSetup,
};

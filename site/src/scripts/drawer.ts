// Full-screen nav drawer(s) — focus trap, Esc to close, aria-expanded on
// the trigger, body scroll lock, return focus on close. The design
// reference used a `position: sticky` workaround for the drawer (see
// README's implementation note); this uses `position: fixed; inset: 0` as
// the doc recommends for production.
//
// Each trigger is paired with its drawer via aria-controls/id, so the page
// can host more than one independent drawer (e.g. the true-mobile drawer
// below 640px and a separate tablet-range drawer for 640–899px).

function initDrawer(trigger: HTMLButtonElement, drawer: HTMLElement) {
  const closeBtn = drawer.querySelector<HTMLButtonElement>('[data-drawer-close]');

  let lastFocused: HTMLElement | null = null;

  const focusablesSelector =
    'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function open() {
    lastFocused = document.activeElement as HTMLElement;
    drawer.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    const first = drawer.querySelector<HTMLElement>(focusablesSelector);
    first?.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function close() {
    drawer.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKeydown);
    (lastFocused ?? trigger)?.focus();
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      close();
      return;
    }
    if (e.key === 'Tab') {
      const focusables = Array.from(drawer.querySelectorAll<HTMLElement>(focusablesSelector));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  trigger.addEventListener('click', () => {
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';
    isOpen ? close() : open();
  });
  closeBtn?.addEventListener('click', close);
  drawer.querySelectorAll<HTMLElement>('[data-drawer-link]').forEach((link) => {
    link.addEventListener('click', close);
  });
}

function initAllDrawers() {
  document.querySelectorAll<HTMLButtonElement>('[data-drawer-trigger]').forEach((trigger) => {
    const targetId = trigger.getAttribute('aria-controls');
    const drawer = targetId && document.getElementById(targetId);
    if (drawer) initDrawer(trigger, drawer);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllDrawers);
} else {
  initAllDrawers();
}

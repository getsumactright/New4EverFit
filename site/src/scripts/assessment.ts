// Assessment quiz controller — drives the 4-step-plus-capture-plus-confirm
// flow described in README.md ("Assessment — the conversion point" /
// "State management"). One controller class, instantiated once per
// [data-assessment] root found on the page (there are two: the desktop
// card and the dedicated mobile card — separate DOM per README's "two
// designs" spec, mutually exclusive via CSS breakpoint, each keeping its
// own independent state).

type State = {
  step: number; // 0..4  (0-3 = question index, 4 = email capture)
  answers: (string | null)[];
  name: string;
  email: string;
  submitted: boolean;
  error: string;
  pending: boolean;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PILLAR_NAMES = ['Nutrition', 'Strength training', 'Cardio', 'Supplementation'];

function initialState(): State {
  return {
    step: 0,
    answers: [null, null, null, null],
    name: '',
    email: '',
    submitted: false,
    error: '',
    pending: false,
  };
}

class AssessmentController {
  root: HTMLElement;
  state: State = initialState();

  progressItems: HTMLElement[];
  stepPanels: Map<number, HTMLElement>;
  capturePanel: HTMLElement | null;
  submittedPanel: HTMLElement | null;
  backButtons: HTMLElement[];
  footerRows: HTMLElement[];
  progressLabelEls: HTMLElement[];
  liveRegion: HTMLElement | null;
  form: HTMLFormElement | null;
  nameInput: HTMLInputElement | null;
  emailInput: HTMLInputElement | null;
  errorEl: HTMLElement | null;
  thanksTitleEl: HTMLElement | null;
  submitBtn: HTMLButtonElement | null;
  advanceTimer: number | null = null;

  constructor(root: HTMLElement) {
    this.root = root;
    this.progressItems = Array.from(root.querySelectorAll<HTMLElement>('[data-progress-item]'));
    this.stepPanels = new Map();
    root.querySelectorAll<HTMLElement>('[data-step-panel]').forEach((el) => {
      const key = el.dataset.stepPanel;
      if (key !== undefined && key !== 'capture' && key !== 'submitted') {
        this.stepPanels.set(Number(key), el);
      }
    });
    this.capturePanel = root.querySelector('[data-step-panel="capture"]');
    this.submittedPanel = root.querySelector('[data-step-panel="submitted"]');
    this.backButtons = Array.from(
      root.querySelectorAll<HTMLElement>('[data-role="footer-row"] [data-action="back"]')
    );
    this.footerRows = Array.from(root.querySelectorAll<HTMLElement>('[data-role="footer-row"]'));
    this.progressLabelEls = Array.from(root.querySelectorAll<HTMLElement>('[data-role="progress-label"]'));
    this.liveRegion = root.querySelector('[data-role="live-region"]');
    this.form = root.querySelector('form[data-step-panel="capture"]');
    this.nameInput = root.querySelector('input[name$="-name"]');
    this.emailInput = root.querySelector('input[name$="-email"]');
    this.errorEl = root.querySelector('[data-role="error"]');
    this.thanksTitleEl = root.querySelector('[data-role="thanks-title"]');
    this.submitBtn = root.querySelector('[data-action="submit"]');

    this.bind();
    this.render();
  }

  bind() {
    // Options — real radio inputs; selecting one records the answer AND
    // advances immediately (no Next button), per README.
    // All Back buttons (footer row + the one embedded in the capture form)
    // share this click handler; only the footer-row one is ever hidden by
    // render() — the capture-form one is always visible while its form is.
    this.root.querySelectorAll<HTMLElement>('[data-action="back"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (this.state.submitted) return;
        if (this.advanceTimer !== null) {
          window.clearTimeout(this.advanceTimer);
          this.advanceTimer = null;
        }
        this.state.error = '';
        this.state.step = Math.max(0, Math.min(this.state.step, 4) - 1);
        this.render();
      });
    });

    this.root.querySelectorAll<HTMLInputElement>('input[type="radio"][data-step]').forEach((input) => {
      input.addEventListener('change', () => {
        const step = Number(input.dataset.step);
        this.state.answers[step] = input.value;
        this.state.error = '';

        // Hold briefly before advancing so the selected marker is actually
        // seen. Selecting and advancing in the same frame reads as "nothing
        // happened, then the screen moved" — which is how this behaved
        // before the :checked state existed at all. A second click inside
        // the window replaces the pending advance rather than queueing one.
        if (this.advanceTimer !== null) window.clearTimeout(this.advanceTimer);
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.advanceTimer = window.setTimeout(() => {
          this.advanceTimer = null;
          this.state.step = Math.min(step + 1, 4);
          this.render();
        }, reduced ? 0 : 180);
      });
    });

    this.root.querySelectorAll<HTMLElement>('[data-action="start-over"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (this.advanceTimer !== null) {
          window.clearTimeout(this.advanceTimer);
          this.advanceTimer = null;
        }
        this.state = initialState();
        this.render();
        this.focusHeading();
      });
    });

    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    }

    if (this.nameInput) {
      this.nameInput.addEventListener('input', () => {
        this.state.name = this.nameInput!.value;
      });
    }
    if (this.emailInput) {
      this.emailInput.addEventListener('input', () => {
        this.state.email = this.emailInput!.value;
        if (this.state.error) {
          this.state.error = '';
          this.render();
        }
      });
    }
  }

  async handleSubmit() {
    const email = this.emailInput?.value.trim() ?? '';
    if (!EMAIL_RE.test(email)) {
      this.state.error = 'Enter a valid email';
      this.render();
      this.errorEl?.focus();
      return;
    }
    this.state.email = email;
    this.state.error = '';
    this.state.pending = true;
    this.render();

    try {
      // Stubbed per README ("Backend work required — currently stubbed"):
      // POST to a real endpoint/CRM/ESP before launch. Swallow failure of
      // the fetch itself (e.g. no /api route in this static build) so the
      // designed confirmation state still shows in local/dev use.
      await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: this.state.name,
          email: this.state.email,
          answers: this.state.answers,
        }),
      }).catch(() => null);
      this.state.submitted = true;
      this.state.pending = false;
      this.render();
      this.focusHeading();
    } catch {
      this.state.pending = false;
      this.state.error = 'Something went wrong — try again.';
      this.render();
    }
  }

  focusHeading() {
    const visiblePanel =
      this.stepPanels.get(Math.min(this.state.step, 3)) ??
      this.capturePanel ??
      this.submittedPanel;
    const heading = visiblePanel?.querySelector<HTMLElement>('h3, [data-role="thanks-title"]');
    heading?.setAttribute('tabindex', '-1');
    heading?.focus();
  }

  render() {
    const { step, answers, submitted, error, pending, name } = this.state;
    const asking = step < 4 && !submitted;
    const capturing = step >= 4 && !submitted;
    const canGoBack = step > 0 && !submitted;
    const clampedStep = Math.min(step, 3);
    const progressLabel = `Question ${clampedStep + 1} of 4`;
    const thanksTitle = name ? `Thanks, ${name}.` : 'Your assessment is in.';

    // Panels
    this.stepPanels.forEach((panel, i) => {
      panel.hidden = !(asking && i === clampedStep);
    });
    if (this.capturePanel) this.capturePanel.hidden = !capturing;
    if (this.submittedPanel) this.submittedPanel.hidden = !submitted;

    // Progress header
    this.progressItems.forEach((item) => {
      const idx = Number(item.dataset.progressItem);
      const done = !!answers[idx];
      item.dataset.done = String(done);
      const isCurrent = asking && idx === clampedStep;
      if (isCurrent) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    });

    // Footer labels
    this.progressLabelEls.forEach((el) => {
      el.textContent = progressLabel;
    });

    // Footer row (Back + "Question N of 4") only belongs to the asking
    // steps per the design spec — the capture step has its own inline Back
    // next to Submit, and submitted has no Back at all.
    this.footerRows.forEach((row) => {
      row.hidden = !asking;
    });
    this.backButtons.forEach((btn) => {
      btn.hidden = !canGoBack;
    });

    // Radios reflect persisted answers
    this.root.querySelectorAll<HTMLInputElement>('input[type="radio"][data-step]').forEach((input) => {
      const s = Number(input.dataset.step);
      input.checked = answers[s] === input.value;
    });

    // Error
    if (this.errorEl) {
      this.errorEl.textContent = error;
      this.errorEl.hidden = !error;
    }
    this.emailInput?.setAttribute('aria-invalid', error ? 'true' : 'false');

    // Submit button pending state
    if (this.submitBtn) {
      (this.submitBtn as HTMLButtonElement).disabled = pending;
      this.submitBtn.style.opacity = pending ? '0.45' : '';
      this.submitBtn.textContent = pending ? 'Sending…' : 'Send my plan';
    }

    // Thanks title
    if (this.thanksTitleEl) this.thanksTitleEl.textContent = thanksTitle;

    // Live region announcement for step changes (a11y — called out as
    // still-to-do in README; wired up here).
    if (this.liveRegion) {
      if (asking) {
        this.liveRegion.textContent = `${progressLabel}: ${PILLAR_NAMES[clampedStep]}`;
      } else if (capturing) {
        this.liveRegion.textContent = 'Last step: where should we send the plan?';
      } else if (submitted) {
        this.liveRegion.textContent = thanksTitle;
      }
    }
  }
}

function init() {
  document.querySelectorAll<HTMLElement>('[data-assessment]').forEach((root) => {
    new AssessmentController(root);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

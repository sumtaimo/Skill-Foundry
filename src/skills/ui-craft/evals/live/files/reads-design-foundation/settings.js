const form = document.getElementById('profile-form');
const name = document.getElementById('name');
const save = document.getElementById('save');
const nameError = document.getElementById('name-error');
const saveError = document.getElementById('save-error');
const status = document.getElementById('save-status');
let saved = name.value;

function validate() {
  const bad = name.value.trim() === '';
  nameError.hidden = !bad;
  name.toggleAttribute('aria-invalid', bad);
  if (bad) name.setAttribute('aria-invalid', 'true');
  return !bad;
}

name.addEventListener('input', () => {
  save.disabled = name.value === saved;
  status.textContent = '';
  if (!nameError.hidden) validate();
});

// Replace this stub with your real request. Throw on failure to show the error + Retry.
async function persist(value) { /* await fetch(...) */ }

async function doSave() {
  if (!validate()) { name.focus(); return; }
  form.dataset.state = 'saving';
  save.disabled = true;
  saveError.hidden = true;
  try {
    await persist(name.value.trim());
    saved = name.value;
    status.textContent = 'Saved.';
  } catch {
    saveError.hidden = false;
    save.disabled = false;
  } finally {
    form.dataset.state = 'idle';
  }
}

form.addEventListener('submit', (e) => { e.preventDefault(); doSave(); });
document.getElementById('retry').addEventListener('click', doSave);
// Set form.dataset.state = 'loading' while the profile loads, then 'idle'.

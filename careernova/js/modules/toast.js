/* CareerNova - Toast Notification Controller */

let toastTimer = null;

export function showToast(message) {
  const toast = document.getElementById('toast-notification');
  if (!toast) return;

  toast.innerText = message;
  toast.classList.remove('hidden');
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.classList.add('hidden'), 250);
  }, 3200);
}

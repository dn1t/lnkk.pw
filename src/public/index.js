const toggleAdvanced = (checked, isFirst) => {
  Array.from(document.getElementsByClassName('advanced')).forEach((el) => {
    if (checked) {
      el.classList.remove('h-0', 'opacity-0');
      el.classList.add('mt-2');
    } else {
      el.classList.remove('mt-2');
      el.classList.add('h-0', 'opacity-0');
    }

    if (isFirst)
      setTimeout(() => el.classList.add('transition-all', 'duration-500'), 10);
  });
};

window.addEventListener('DOMContentLoaded', () => {
  const custom = document.getElementById('custom');

  toggleAdvanced(custom.checked, true);

  custom.addEventListener('click', (e) => toggleAdvanced(e.target.checked));
});

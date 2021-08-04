const toggleAdvanced = (checked, isFirst) => {
  const main = document.getElementsByTagName('main')[0];

  Array.from(document.getElementsByClassName('advanced')).forEach((el) => {
    if (checked) {
      el.classList.replace('max-h-0', 'max-h-18');
      el.classList.replace('opacity-0', 'mt-1');
      main.classList.replace('max-w-sm', 'max-w-md');
    } else {
      el.classList.replace('max-h-18', 'max-h-0');
      el.classList.replace('mt-1', 'opacity-0');
      main.classList.replace('max-w-md', 'max-w-sm');
    }

    if (isFirst)
      setTimeout(() => {
        el.classList.add('transition-all', 'duration-300');
        main.classList.add('transition-all');
      }, 10);
  });
};

const toggleModal = () => {
  const modal = document.getElementById('modal');
  const background = document.getElementById('background');

  if (modal.classList.contains('opacity-100')) {
    modal.classList.replace('opacity-100', 'opacity-0');
    modal.classList.replace('translate-y-4', 'translate-y-0');
    modal.classList.replace('sm:scale-95', 'sm:scale-100');
    modal.classList.remove('sm:translate-y-0');

    background.classList.replace('opacity-100', 'opacity-0');

    setTimeout(
      () => document.querySelector('div[role=dialog]').classList.add('hidden'),
      300
    );
  } else {
    document.querySelector('div[role=dialog]').classList.remove('hidden');
    modal.classList.replace('opacity-0', 'opacity-100');
    modal.classList.replace('translate-y-0', 'translate-y-4');
    modal.classList.replace('sm:scale-100', 'sm:scale-95');
    modal.classList.add('sm:translate-y-0');

    background.classList.replace('opacity-0', 'opacity-100');
  }
};

const copyUrl = () => {
  navigator.clipboard
    .writeText(document.getElementById('result').value)
    .then(() => {
      Toastify({
        text: 'URL이 클립보드에 복사되었습니다.',
        duration: 3000,
        gravity: 'bottom',
        position: 'right',
        backgroundColor: 'white',
        className: 'copied shadow-md rounded-md',
        stopOnFocus: true,
      }).showToast();
      toggleModal();
    });
};

window.addEventListener('DOMContentLoaded', () => {
  const alertError = (text) =>
    Toastify({
      text,
      duration: 3000,
      gravity: 'bottom',
      position: 'right',
      backgroundColor: 'white',
      className: 'error shadow-md rounded-md',
      stopOnFocus: true,
    }).showToast();

  const custom = document.getElementById('custom');
  const link = document.getElementById('link');

  link.addEventListener('keyup', (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/gi, '');
  });

  toggleAdvanced(custom.checked, true);

  custom.addEventListener('click', (e) => toggleAdvanced(e.target.checked));

  document.getElementById('form').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (custom.checked && (link.length < 4 || link.length > 12))
      return alertError('커스텀 URL은 4자 이상 12자 이하만 가능합니다.');

    const res = await fetch(
      `/shorten?url=${e.target[0].value}${
        custom.checked ? `&custom=${e.target[1].value}` : ''
      }`
    );

    if (!res.ok) {
      if (res.status === 400) return alertError(await res.text());
      else return notyf.error('알 수 없는 에러가 발생했습니다.');
    }

    e.target[0].value = '';
    e.target[1].value = '';

    document.getElementById('result').value = `https://lnkk.pw/${
      (await res.json()).id
    }`;
    toggleModal();
  });
});

// window.addEventListener('load', () =>
//   new Darkmode({
//     label: '🌓',
//     time: '0s',
//     autoMatchOsTheme: false,
//   }).showWidget()
// );

window.addEventListener('DOMContentLoaded', () => {
  Array.from(document.getElementsByClassName('advanced')).forEach((el) =>
    el.classList[document.getElementById('custom') ? 'remove' : 'add']('hidden')
  );

  document
    .getElementById('custom')
    .addEventListener('click', (e) =>
      Array.from(document.getElementsByClassName('advanced')).forEach((el) =>
        el.classList[e.target.checked ? 'remove' : 'add']('hidden')
      )
    );
});

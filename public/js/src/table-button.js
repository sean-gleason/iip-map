const button = document.getElementById( 'toggle-table' );
const div = document.getElementById( 'event-list' );

function toggleTable() {
  div.classList.toggle( 'hidden' );
  button.innerHTML = button.innerHTML === 'View this map as a table' ? 'Hide table' : 'View this map as a table';
}

button.addEventListener( 'click', toggleTable, false );

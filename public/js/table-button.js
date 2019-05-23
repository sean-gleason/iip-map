function toggleTable() {
  const button = document.getElementById( 'toggle-table' );
  const div = document.getElementById( 'event-list' );
  div.style.display = div.style.display === 'none' ? 'block' : 'none';
  button.innerHTML = button.innerHTML === 'View this map as a table' ? 'Hide table' : 'View this map as a table';
}

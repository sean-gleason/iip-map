<?php
require_once('../../../../wp/wp-load.php');

$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASSWORD;
$dbname = DB_NAME;

$dsn = 'mysql:host='. $servername . ';dbname=' . $dbname;
$opt = [
  PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
];

try {

  //Create connection
  $conn = new PDO($dsn, $username, $password, $opt);

  $query = 'INSERT INTO wp_iip_map_data (map_id, venue_city, venue_region, venue_country) VALUES (:map_id, :venue_city, :venue_region, :venue_country)';

  $stmt = $conn->prepare($query);
  $stmt->bindParam(":map_id", $map_id);
  $stmt->bindParam(":venue_city", $venue_city);
  $stmt->bindParam(":venue_region", $venue_region);
  $stmt->bindParam(":venue_country", $venue_country);

  $entry_data = $_POST;
  $map_id = $entry_data['map_id'];
  $venue_city = $entry_data['venue_city'];
  $venue_region = $entry_data['venue_region'];
  $venue_country = $entry_data['venue_country'];

  $stmt->execute();

  echo "New record created successfully";

} catch (PDOException $e) {

    echo "<strong>ERROR</strong><br>" . $sql . "<br>" . $e->getMessage();

}

$conn = null;

?>

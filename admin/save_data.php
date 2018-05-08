<?php
require_once('../../../../wp/wp-load.php');

$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASSWORD;
$dbname = DB_NAME;

$dsn = 'mysql:host='. $servername . ';dbname=' . $dbname;

$entry_data = $_POST["entry_data"];

try {
  //Create connection
  $conn = new PDO($dsn, $username, $password);

  // Check connection
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected to the server<br>";

  $sql = 'INSERT INTO wp_iip_map_data (map_id, venue_city, venue_region, venue_country) VALUES (:map_id, :venue_city, :venue_region, :venue_country)';

  $stmt = $conn->prepare($sql);
  $stmt->bindParam(":map_id", $entry_data->map_id, PDO::PARAM_INT);
  $stmt->bindParam(":venue_city", $entry_data->venue_city, PDO::PARAM_STR);
  $stmt->bindParam(":venue_region", $entry_data->venue_region, PDO::PARAM_STR);
  $stmt->bindParam(":venue_country", $entry_data->venue_country, PDO::PARAM_STR);

  $stmt->execute();

  // foreach ($entry_data as $entry_data_rec) {
  //   $map_id = $entry_data_rec['map_id'];
  //   $venue_city = $entry_data_rec['venue_city'];
  //   $venue_region = $entry_data_rec['venue_region'];
  //   $venue_country = $entry_data_rec['venue_country'];
  //   $stmt->execute();
  // }
  echo "New record created successfully";
}
catch(PDOException $e)
  {
    echo "<strong>ERROR</strong><br>" . $sql . "<br>" . $e->getMessage();
  }

$conn = null;

?>

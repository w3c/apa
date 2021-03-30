<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" dir="ltr">
	<head>
<?php include "_head.phi"; ?> 		
		<title>APA Archives</title>
	</head>
	<body>
<?php include "_header.phi"; ?>		
		<h1>APA Archives</h1>
		
		<p>References to resources that no longer have primary immediate value but should be available for archival purposes.</p>
		
<?php
$group = "APA";
require_once "_db_connect.phi";
$sth = $dbh->prepare("select * from announcements where `group` = :group and (date_start <= curdate() or date_start IS NULL) and (date_end <= curdate()) order by date_display, date_start, header;");
$sth->bindValue(":group", $group, PDO::PARAM_STR);
$sth->execute();
if ($sth->rowCount() > 0) {
?>
		<section id="announcements">
			<h2>Past Announcements</h2>
<?php
	while ($row = $sth->fetch()) {
		print("<p>");
		if ($row['date_display'] != null) print("<em>" . $row['date_display'] . "</em> - ");
		else if ($row['date_start'] != null) print("<em>" . $row['date_start'] . "</em> - ");
		if ($row['header'] != null) print("<strong>" . $row['header']  . "</strong>: ");
		print($row['text']);
		print("</p>");
	}
?>
		</section>
<?php
}
?>

<?php include "_footer.phi"; ?> 		
	</body>
</html>
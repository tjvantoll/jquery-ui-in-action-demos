<?
	$movies = array(
		"ghostbusters" => array(
			"title" => "Ghostbusters",
			"box_office" => "238",
			"budget" => "30",
			"release" => "June 8th, 1984"
		),
		"titanic" => array(
			"title" => "Titanic",
			"box_office" => "658",
			"budget" => "200",
			"release" => "December 19th, 1997"
		),
		"top_gun" => array(
			"title" => "Top Gun",
			"box_office" => "179",
			"budget" => "15",
			"release" => "May 16th, 1986"
		)
	);

	$movie = $movies[ $_GET[ "movie" ] ];
?>

<h3><? echo $movie[ "title" ] ?></h3>

<ul>
	<li>
		<strong>Box Office</strong>: 
		<? echo $movie[ "box_office" ] ?> million USD
	</li>
	<li>
		<strong>Budget</strong>: 
		<? echo $movie[ "budget" ] ?> million USD
	</li>
	<li>
		<strong>Released</strong>: 
		<? echo $movie[ "release" ] ?>
	</li>
</ul>

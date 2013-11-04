<?
$term = $_GET[ "term" ];
$companies = array(
	array( "label" => "One", "value" => "1" ),
	array( "label" => "Two", "value" => "2" ),
	array( "label" => "Three", "value" => "3" )
);

$result = array();
foreach ($companies as $company) {
	$companyLabel = $company[ "label" ];
	if ( strpos( strtoupper($companyLabel), strtoupper($term) )
	  !== false ) {
		array_push( $result, $company );
	}
}

echo json_encode( $result );
?>
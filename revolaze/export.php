<?php
function generateRandomString($length = 10) {
    $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

function customError($errno, $errstr) {
    echo "<b>Error: </b> [$errno] $errstr";
}
set_error_handler("customError");

$len = $_POST['numOfLayers'];
exec("rm -rf /var/www/html/output/");
$dir = $_SERVER['DOCUMENT_ROOT'] . "/output";
$path = $_SERVER['DOCUMENT_ROOT'] . "/output/" . generateRandomString() . ".tiff";

if(!is_dir($dir) && strlen($dir)>0)
    mkdir($dir, 0777, true);
$imagemagick = new Imagick();
$imagemagick->setFormat("tiff");

for($i=0; $i<$len; $i++)
{
    $img = $_POST["L" . $i];
    $img = str_replace('data:image/png;base64,', '', $img);
    $img = str_replace(' ', '+', $img);
    $fileData = base64_decode($img);
    $im = new Imagick();
    $im->readimageblob($fileData);
    $imagemagick->addImage($im);
}

$imagemagick->writeImages($path, true);

if(file_exists($path)) {
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="'. basename($path). '"');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($path));
    ignore_user_abort(true);
    ob_clean();
    flush();
    readfile($path);
    if (connection_aborted()) {
        unlink($path);
    }
    exit;
}

?>

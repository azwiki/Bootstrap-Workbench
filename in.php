<?php
// PHP File Directory Listing Script - fixed for PHP 8.x
// Based on HalGatewood.com v1.4

// ADD SPECIFIC FILES YOU WANT TO IGNORE HEREт
$ignore_file_list = ['.', '..', 'Thumbs.db', '.DS_Store', 'index.php', '.htaccess', 'was-.htaccess', 'icons.png'];

// ADD SPECIFIC FILE EXTENSIONS YOU WANT TO IGNORE HERE (leave blank for all)
$ignore_ext_list = [];

$dir = dirname(__FILE__);
$title = cleanTitle(basename($dir));

// ── functions ──────────────────────────────────────────────────────────────────

function cleanTitle(string $t): string
{
    return ucwords(str_replace(['-', '_'], ' ', $t));
}

function getFileExt(string $filename): string
{
    $ext = pathinfo($filename, PATHINFO_EXTENSION);
    return strtolower($ext);
}

function format_size(string $file): string
{
    $bytes = @filesize($file);
    if ($bytes === false) return '?';
    if ($bytes < 1024)         return $bytes . ' B';
    if ($bytes < 1048576)      return round($bytes / 1024, 1) . ' KB';
    if ($bytes < 1073741824)   return round($bytes / 1048576, 1) . ' MB';
    if ($bytes < 1099511627776) return round($bytes / 1073741824, 1) . ' GB';
    return round($bytes / 1099511627776, 1) . ' TB';
}

// Emoji- by type (doesn't depends  on outside URL)
function getIcon(string $ext, bool $isDir): string
{
    if ($isDir) return '📁';
    return match($ext) {
        'jpg','jpeg','gif','png','webp','svg','avif' => '🖼️',
        'pdf'                                         => '📄',
        'txt','rtf','md'                              => '📝',
        'xls','xlsx','csv'                            => '📊',
        'ppt','pptx'                                  => '📑',
        'doc','docx'                                  => '📃',
        'zip','rar','tar','gz','7z'                   => '🗜️',
        'mp3','wav','aiff','flac','ogg'               => '🎵',
        'mp4','mov','avi','mkv','mpg','flv'           => '🎬',
        'php','html','htm','css','js','json','xml'    => '💻',
        'psd','ai'                                    => '🎨',
        'sql'                                         => '🗄️',
        default                                       => '📎',
    };
}

// ── collecting files ───────────────────────────────────────────────────────────────

$entries = scandir($dir);   // already sorted by A→Z
$dirs  = [];
$files = [];

foreach ($entries as $entry) {
    if (in_array($entry, $ignore_file_list, true)) continue;

    $fullPath = $dir . DIRECTORY_SEPARATOR . $entry;
    $ext      = getFileExt($entry);

    if (in_array($ext, $ignore_ext_list, true)) continue;

    if (is_dir($fullPath)) {
        $dirs[] = $entry;
    } else {
        $files[] = $entry;
    }
}

?><!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= htmlspecialchars($title) ?></title>
<style>
  *, *::before, *::after { box-sizing: border-box; }
  body   { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
           margin: 0; padding: 0; background: #f0f2f5; color: #222; }
  .wrap  { max-width: 680px; margin: 3em auto; background: #fff;
           border-radius: 10px; border: 1px solid #ddd; overflow: hidden; }
  h1     { margin: 0; padding: 18px 20px; font-size: 1.1rem; font-weight: 600;
           color: #444; border-bottom: 1px solid #eee; background: #fafafa; }
  .row   { display: flex; align-items: center; padding: 9px 16px;
           border-bottom: 1px solid #f0f0f0; gap: 10px; }
  .row:last-child { border-bottom: none; }
  .row:hover { background: #f7f9fc; }
  .icon  { font-size: 1.4rem; flex-shrink: 0; width: 28px; text-align: center; }
  .name  { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .name a { color: #1a73e8; text-decoration: none; font-size: 0.95rem; }
  .name a:hover { text-decoration: underline; }
  .meta  { font-size: 0.75rem; color: #888; white-space: nowrap; text-align: right; min-width: 120px; }
  .empty { padding: 30px; text-align: center; color: #aaa; font-size: 0.9rem; }
</style>
</head>
<body>
<div class="wrap">
  <h1>📂 <?= htmlspecialchars($title) ?></h1>

<?php

// Link up if not root
$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
if (rtrim($requestUri, '/') !== '') {
    $parent = dirname(rtrim($requestUri, '/'));
    echo '<div class="row">';
    echo '  <div class="icon">⬆️</div>';
    echo '  <div class="name"><a href="' . htmlspecialchars($parent ?: '/') . '">..</a></div>';
    echo '  <div class="meta">parent directory</div>';
    echo '</div>';
}

// Folders
foreach ($dirs as $entry) {
    $fullPath = $dir . DIRECTORY_SEPARATOR . $entry;
    $mtime    = filemtime($fullPath);
    $icon     = getIcon('', true);
    echo '<div class="row">';
    echo '  <div class="icon">' . $icon . '</div>';
    echo '  <div class="name"><a href="' . rawurlencode($entry) . '/">' . htmlspecialchars($entry) . '</a></div>';
    echo '  <div class="meta">' . date('d.m.Y H:i', $mtime) . '</div>';
    echo '</div>';
}

// Files
foreach ($files as $entry) {
    $fullPath = $dir . DIRECTORY_SEPARATOR . $entry;
    $ext      = getFileExt($entry);
    $mtime    = filemtime($fullPath);
    $size     = format_size($fullPath);
    $icon     = getIcon($ext, false);
    echo '<div class="row">';
    echo '  <div class="icon">' . $icon . '</div>';
    echo '  <div class="name"><a href="' . rawurlencode($entry) . '">' . htmlspecialchars($entry) . '</a></div>';
    echo '  <div class="meta">' . $size . ' &nbsp; ' . date('d.m.Y H:i', $mtime) . '</div>';
    echo '</div>';
}

if (empty($dirs) && empty($files)) {
    echo '<div class="empty">Директория пуста</div>';
}

?>
  </div>
</body>
</html>
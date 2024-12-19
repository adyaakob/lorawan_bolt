Get-ChildItem -Path "c:/Project/lorawan_bolt/pages" -Filter "*.html" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $newContent = $content -replace 'href="/pages/', 'href="/lorawan_bolt/pages/'
    $newContent | Set-Content $_.FullName
}

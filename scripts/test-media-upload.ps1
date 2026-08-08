param(
  [string]$ApiBaseUrl = 'http://localhost:4000',
  [string]$Email = 'admin@duongbo.com',
  [string]$Password = 'Admin@123456',
  [Parameter(Mandatory = $true)]
  [string]$FilePath,
  [switch]$DeleteAfterUpload
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-ContentType {
  param([string]$Path)

  $ext = [System.IO.Path]::GetExtension($Path).ToLowerInvariant()
  switch ($ext) {
    '.jpg' { return 'image/jpeg' }
    '.jpeg' { return 'image/jpeg' }
    '.png' { return 'image/png' }
    '.gif' { return 'image/gif' }
    '.webp' { return 'image/webp' }
    '.svg' { return 'image/svg+xml' }
    '.pdf' { return 'application/pdf' }
    default { return 'application/octet-stream' }
  }
}

$resolvedPath = (Resolve-Path -Path $FilePath).Path
if (-not (Test-Path -Path $resolvedPath -PathType Leaf)) {
  throw "File not found: $FilePath"
}

Add-Type -AssemblyName System.Net.Http
$client = [System.Net.Http.HttpClient]::new()
$fileStream = $null
$multipart = $null

try {
  $loginPayload = @{ email = $Email; password = $Password } | ConvertTo-Json -Compress
  $loginContent = [System.Net.Http.StringContent]::new(
    $loginPayload,
    [System.Text.Encoding]::UTF8,
    'application/json'
  )

  $loginResponse = $client.PostAsync("$ApiBaseUrl/auth/login", $loginContent).GetAwaiter().GetResult()
  $loginJson = $loginResponse.Content.ReadAsStringAsync().GetAwaiter().GetResult()

  if (-not $loginResponse.IsSuccessStatusCode) {
    throw "Login failed ($($loginResponse.StatusCode)): $loginJson"
  }

  $loginData = $loginJson | ConvertFrom-Json
  if (-not $loginData.access_token) {
    throw 'Login succeeded but access_token is missing'
  }

  $token = [string]$loginData.access_token

  $fileStream = [System.IO.File]::OpenRead($resolvedPath)
  $fileContent = [System.Net.Http.StreamContent]::new($fileStream)
  $fileContent.Headers.ContentType = [System.Net.Http.Headers.MediaTypeHeaderValue]::Parse((Get-ContentType -Path $resolvedPath))

  $multipart = [System.Net.Http.MultipartFormDataContent]::new()
  $multipart.Add($fileContent, 'file', [System.IO.Path]::GetFileName($resolvedPath))

  $uploadRequest = [System.Net.Http.HttpRequestMessage]::new([System.Net.Http.HttpMethod]::Post, "$ApiBaseUrl/media/upload")
  $uploadRequest.Headers.Authorization = [System.Net.Http.Headers.AuthenticationHeaderValue]::new('Bearer', $token)
  $uploadRequest.Content = $multipart

  $uploadResponse = $client.SendAsync($uploadRequest).GetAwaiter().GetResult()
  $uploadJson = $uploadResponse.Content.ReadAsStringAsync().GetAwaiter().GetResult()

  if (-not $uploadResponse.IsSuccessStatusCode) {
    throw "Upload failed ($($uploadResponse.StatusCode)): $uploadJson"
  }

  $media = $uploadJson | ConvertFrom-Json
  Write-Host 'Upload success:' -ForegroundColor Green
  $media | ConvertTo-Json -Depth 10

  $listRequest = [System.Net.Http.HttpRequestMessage]::new([System.Net.Http.HttpMethod]::Get, "$ApiBaseUrl/media")
  $listRequest.Headers.Authorization = [System.Net.Http.Headers.AuthenticationHeaderValue]::new('Bearer', $token)

  $listResponse = $client.SendAsync($listRequest).GetAwaiter().GetResult()
  $listJson = $listResponse.Content.ReadAsStringAsync().GetAwaiter().GetResult()

  if (-not $listResponse.IsSuccessStatusCode) {
    throw "List failed ($($listResponse.StatusCode)): $listJson"
  }

  Write-Host 'Latest media list (first 3):' -ForegroundColor Cyan
  ($listJson | ConvertFrom-Json | Select-Object -First 3) | ConvertTo-Json -Depth 10

  if ($DeleteAfterUpload -and $media.id) {
    $deleteRequest = [System.Net.Http.HttpRequestMessage]::new(
      [System.Net.Http.HttpMethod]::Delete,
      "$ApiBaseUrl/media/$($media.id)"
    )
    $deleteRequest.Headers.Authorization = [System.Net.Http.Headers.AuthenticationHeaderValue]::new('Bearer', $token)

    $deleteResponse = $client.SendAsync($deleteRequest).GetAwaiter().GetResult()
    $deleteJson = $deleteResponse.Content.ReadAsStringAsync().GetAwaiter().GetResult()

    if (-not $deleteResponse.IsSuccessStatusCode) {
      throw "Delete failed ($($deleteResponse.StatusCode)): $deleteJson"
    }

    Write-Host 'Delete success:' -ForegroundColor Yellow
    Write-Output $deleteJson
  }
}
finally {
  if ($fileStream) { $fileStream.Dispose() }
  if ($multipart) { $multipart.Dispose() }
  if ($client) { $client.Dispose() }
}

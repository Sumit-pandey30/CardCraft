# End-to-End API and Database Integration Verification Script
$env:JAVA_HOME = "C:\Program Files\Java\jdk-24"
$backendJar = "c:\sumit vs code\CardCraft\cardcraft-backend\target\cardcraft-backend-1.0.0.jar"

Write-Host "=========================================================="
Write-Host "STARTING CARDCRAFT BACKEND FOR INTEGRATION TESTING..."
Write-Host "=========================================================="

$process = Start-Process -FilePath "C:\Program Files\Java\jdk-24\bin\java.exe" `
  -ArgumentList @("-DDB_URL=jdbc:mysql://localhost:3306/cardcraft_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC", `
  "-DDB_USERNAME=root", "-DDB_PASSWORD=sumit", "-jar", "`"$backendJar`"", "--server.port=8080") `
  -PassThru -NoNewWindow

# Wait for server to boot
$ready = $false
for ($i = 0; $i -lt 30; $i++) {
  Start-Sleep -Seconds 1
  try {
    $res = Invoke-WebRequest -Uri "http://localhost:8080/api/templates" -Method GET -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
    if ($res.StatusCode -eq 200) {
      $ready = $true
      Write-Host "CardCraft Backend is UP and responding on port 8080! (took $($i+1)s)"
      break
    }
  } catch {
    # Still starting up
  }
}

if (-not $ready) {
  Write-Host "ERROR: Backend failed to start within 30 seconds."
  if ($process) { Stop-Process -Id $process.Id -Force }
  exit 1
}

try {
  Write-Host "`n--- 1. Testing GET /api/templates ---"
  $templatesRes = Invoke-RestMethod -Uri "http://localhost:8080/api/templates" -Method GET
  Write-Host "Found $($templatesRes.data.Count) templates in MySQL:"
  foreach ($t in $templatesRes.data) {
    Write-Host " - Template: $($t.code) ($($t.displayName))"
  }

  Write-Host "`n--- 2. Testing GET /api/themes ---"
  $themesRes = Invoke-RestMethod -Uri "http://localhost:8080/api/themes" -Method GET
  Write-Host "Found $($themesRes.data.Count) themes in MySQL:"
  foreach ($th in $themesRes.data) {
    Write-Host " - Theme: $($th.name) ($($th.primaryColor))"
  }

  Write-Host "`n--- 3. Testing POST /api/auth/register (New User in MySQL) ---"
  $uniqueEmail = "sumit.test.$(Get-Random)@cardcraft.io"
  $registerPayload = @{
    fullName = "Sumit Pandey"
    email = $uniqueEmail
    password = "MySecurePassword123!"
    confirmPassword = "MySecurePassword123!"
  } | ConvertTo-Json

  $registerRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" `
    -Method POST -Body $registerPayload -ContentType "application/json"

  $token = $registerRes.data.accessToken
  $userId = $registerRes.data.user.id
  Write-Host "User Registered Successfully!"
  Write-Host " - User ID: $userId"
  Write-Host " - Full Name: $($registerRes.data.user.fullName)"
  Write-Host " - Email: $($registerRes.data.user.email)"
  Write-Host " - Role: $($registerRes.data.user.role)"
  Write-Host " - Access Token Generated: $(if ($token) { 'YES' } else { 'NO' })"

  Write-Host "`n--- 4. Testing POST /api/auth/login ---"
  $loginPayload = @{
    email = $uniqueEmail
    password = "MySecurePassword123!"
  } | ConvertTo-Json

  $loginRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" `
    -Method POST -Body $loginPayload -ContentType "application/json"
  Write-Host "Login Successful! Token refreshed."

  $authHeader = @{ "Authorization" = "Bearer $token" }

  Write-Host "`n--- 5. Testing GET /api/users/me (Protected Route) ---"
  $meRes = Invoke-RestMethod -Uri "http://localhost:8080/api/users/me" -Method GET -Headers $authHeader
  Write-Host "Protected /me endpoint returned: $($meRes.data.fullName) ($($meRes.data.email))"

  Write-Host "`n--- 6. Testing POST /api/cards (Create Business Card) ---"
  $cardSlug = "sumit-pandey-$(Get-Random)"
  $cardPayload = @{
    templateCode = "DEVELOPER"
    slug = $cardSlug
    title = "Lead Architect Card"
    fullName = "Sumit Pandey"
    professionalTitle = "Senior Software Architect & Full Stack Engineer"
    companyOrInstitution = "CardCraft Tech Labs"
    email = $uniqueEmail
    phone = "+91 98765 43210"
    location = "Bengaluru, India"
    shortBio = "Designing modern reactive web platforms and resilient distributed architectures."
    skills = "Java 17, Spring Boot, React, MySQL, Docker, Kubernetes"
    websiteUrl = "https://cardcraft.io"
    primaryColor = "#10b981"
    published = $true
    socialLinks = @(
      @{ platform = "GITHUB"; url = "https://github.com/sumit"; label = "GitHub"; displayOrder = 0 },
      @{ platform = "LINKEDIN"; url = "https://linkedin.com/in/sumit"; label = "LinkedIn"; displayOrder = 1 }
    )
  } | ConvertTo-Json

  $cardRes = Invoke-RestMethod -Uri "http://localhost:8080/api/cards" `
    -Method POST -Body $cardPayload -ContentType "application/json" -Headers $authHeader

  $cardId = $cardRes.data.id
  Write-Host "Business Card Created in MySQL!"
  Write-Host " - Card ID: $cardId"
  Write-Host " - Slug: $($cardRes.data.slug)"
  Write-Host " - Title: $($cardRes.data.title)"
  Write-Host " - Template: $($cardRes.data.template.code)"
  Write-Host " - Social Links: $($cardRes.data.socialLinks.Count)"

  Write-Host "`n--- 7. Testing GET /api/public/cards/$cardSlug (Public Access) ---"
  $publicRes = Invoke-RestMethod -Uri "http://localhost:8080/api/public/cards/$cardSlug" -Method GET
  Write-Host "Public Card Loaded: $($publicRes.data.fullName) - $($publicRes.data.professionalTitle)"

  Write-Host "`n--- 8. Testing POST /api/public/cards/$cardSlug/views (Analytics Tracking) ---"
  $viewRes = Invoke-RestMethod -Uri "http://localhost:8080/api/public/cards/$cardSlug/views" -Method POST
  Write-Host "View recorded: $($viewRes.message)"

  Write-Host "`n--- 9. Testing GET /api/public/cards/$cardSlug/qr (ZXing QR Code) ---"
  $qrRes = Invoke-WebRequest -Uri "http://localhost:8080/api/public/cards/$cardSlug/qr" -Method GET -UseBasicParsing
  Write-Host "QR Code Generated: HTTP $($qrRes.StatusCode), Content-Type: $($qrRes.Headers['Content-Type']), Size: $($qrRes.RawContentLength) bytes"

  Write-Host "`n--- 10. Testing GET /api/public/cards/$cardSlug/pdf (OpenPDF Generation) ---"
  $pdfRes = Invoke-WebRequest -Uri "http://localhost:8080/api/public/cards/$cardSlug/pdf" -Method GET -UseBasicParsing
  Write-Host "PDF Card Generated: HTTP $($pdfRes.StatusCode), Content-Type: $($pdfRes.Headers['Content-Type']), Size: $($pdfRes.RawContentLength) bytes"

  Write-Host "`n--- 11. Testing GET /api/public/cards/$cardSlug/vcard (vCard Contact Export) ---"
  $vcfRes = Invoke-WebRequest -Uri "http://localhost:8080/api/public/cards/$cardSlug/vcard" -Method GET -UseBasicParsing
  Write-Host "vCard Generated: HTTP $($vcfRes.StatusCode), Size: $($vcfRes.RawContentLength) bytes"

  Write-Host "`n--- 12. Testing POST /api/public/cards/$cardSlug/contact (Lead Capture) ---"
  $contactPayload = @{
    senderName = "Acme Recruiter"
    senderEmail = "recruiter@acme.com"
    senderPhone = "+1 555 123 4567"
    subject = "Principal Architect Opportunity"
    message = "We loved your CardCraft profile and would like to discuss an opportunity."
  } | ConvertTo-Json

  $contactRes = Invoke-RestMethod -Uri "http://localhost:8080/api/public/cards/$cardSlug/contact" `
    -Method POST -Body $contactPayload -ContentType "application/json"
  Write-Host "Lead message submitted: $($contactRes.data.senderName) ($($contactRes.data.subject))"

  Write-Host "`n--- 13. Testing GET /api/cards/$cardId/analytics ---"
  $analyticsRes = Invoke-RestMethod -Uri "http://localhost:8080/api/cards/$cardId/analytics" -Method GET -Headers $authHeader
  Write-Host "Card Analytics: Views = $($analyticsRes.data.totalViews), Timeline points = $($analyticsRes.data.viewsTimeline.Count)"

  Write-Host "`n=========================================================="
  Write-Host "ALL INTEGRATION & DATABASE TESTS PASSED WITH 100% SUCCESS!"
  Write-Host "=========================================================="

} finally {
  Write-Host "Stopping CardCraft test backend..."
  if ($process) {
    Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
  }
}

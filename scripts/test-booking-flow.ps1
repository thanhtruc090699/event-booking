$baseUrl = "http://localhost:8080"

Write-Host "=== TEST BOOKING FLOW ===" -ForegroundColor Cyan

# PHASE 0: Test without auth
Write-Host "`n--- 0.1: GET seats without token ---"
try {
    $seats = Invoke-RestMethod -Uri "$baseUrl/api/events/1/seats" -Method Get
    Write-Host "PASS: Got $($seats.Count) seats" -ForegroundColor Green
} catch {
    Write-Host "FAIL: $_" -ForegroundColor Red
}

Write-Host "`n--- 0.2: POST reservation without token (expect 401/403) ---"
try {
    Invoke-RestMethod -Uri "$baseUrl/api/reservations" -Method Post -ContentType "application/json" -Body '{"eventSeatId":1}'
    Write-Host "FAIL: Should require auth" -ForegroundColor Red
} catch {
    $code = $_.Exception.Response.StatusCode.value__
    if ($code -eq 401 -or $code -eq 403) {
        Write-Host "PASS: Rejected with $code" -ForegroundColor Green
    } else {
        Write-Host "FAIL: Got $code instead of 401/403" -ForegroundColor Red
    }
}

# PHASE 1: Register
Write-Host "`n--- 1. Register new user ---"
$randomId = Get-Random
$userEmail = "test${randomId}@example.com"
try {
    $user = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -ContentType "application/json" -Body "{`"email`":`"$userEmail`",`"password`":`"password123`",`"fullName`":`"Test User`"}"
    $customerId = $user.customerId
    Write-Host "PASS: Registered customerId=$customerId" -ForegroundColor Green
} catch {
    Write-Host "Register failed, using existing user: $_" -ForegroundColor Yellow
    $customerId = 1
    $userEmail = "test@example.com"
}

# PHASE 2: Login
Write-Host "`n--- 2. Login ---"
try {
    $loginResp = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -ContentType "application/json" -Body "{`"email`":`"$userEmail`",`"password`":`"password123`"}"
    $token = $loginResp.accessToken
    $headers = @{ Authorization = "Bearer $token" }
    Write-Host "PASS: Logged in successfully" -ForegroundColor Green
} catch {
    Write-Host "FAIL: Login error - $_" -ForegroundColor Red
    exit 1
}

# PHASE 3: Get available seats
Write-Host "`n--- 3. Get available seats ---"
$allSeats = Invoke-RestMethod -Uri "$baseUrl/api/events/1/seats" -Method Get
$availableSeats = $allSeats | Where-Object { $_.seatStatus -eq "AVAILABLE" }
Write-Host "Available: $($availableSeats.Count)" -ForegroundColor Cyan
$allSeats | Format-Table seatId, section, rowLabel, seatNumber, seatPrice, seatStatus -AutoSize

if ($availableSeats.Count -eq 0) {
    Write-Host "WARNING: No available seats!" -ForegroundColor Red
}

# PHASE 4: Create reservation
Write-Host "`n--- 4. Create reservation ---"
$seatId = $availableSeats[0].seatId
Write-Host "Reserving seatId=$seatId" -ForegroundColor Cyan
$reservation = Invoke-RestMethod -Uri "$baseUrl/api/reservations" -Method Post -Headers $headers -ContentType "application/json" -Body "{`"eventSeatId`":$seatId}"
$reservationId = $reservation.reservationId
Write-Host "PASS: Created reservationId=$reservationId, status=$($reservation.seatStatus)" -ForegroundColor Green

# Test double reservation
Write-Host "`n--- 4b. Double reservation (expect 409) ---"
try {
    Invoke-RestMethod -Uri "$baseUrl/api/reservations" -Method Post -Headers $headers -ContentType "application/json" -Body "{`"eventSeatId`":$seatId}"
    Write-Host "FAIL: Should reject" -ForegroundColor Red
} catch {
    $code = $_.Exception.Response.StatusCode.value__
    if ($code -eq 409) {
        Write-Host "PASS: Rejected with 409" -ForegroundColor Green
    } else {
        Write-Host "FAIL: Got $code" -ForegroundColor Red
    }
}

# PHASE 5: Create booking
Write-Host "`n--- 5. Create booking from reservation ---"
$booking = Invoke-RestMethod -Uri "$baseUrl/api/bookings" -Method Post -Headers $headers -ContentType "application/json" -Body "{`"reservationId`":$reservationId}"
Write-Host "PASS: Created bookingId=$($booking.bookingId), status=$($booking.status)" -ForegroundColor Green

# Test double booking
Write-Host "`n--- 5b. Double booking (expect 409) ---"
try {
    Invoke-RestMethod -Uri "$baseUrl/api/bookings" -Method Post -Headers $headers -ContentType "application/json" -Body "{`"reservationId`":$reservationId}"
    Write-Host "FAIL: Should reject" -ForegroundColor Red
} catch {
    $code = $_.Exception.Response.StatusCode.value__
    if ($code -eq 409) {
        Write-Host "PASS: Rejected with 409" -ForegroundColor Green
    } else {
        Write-Host "FAIL: Got $code" -ForegroundColor Red
    }
}

# PHASE 6: Verify seat status
Write-Host "`n--- 6. Verify seat status after booking ---"
$seatsAfter = Invoke-RestMethod -Uri "$baseUrl/api/events/1/seats" -Method Get
$bookedSeat = $seatsAfter | Where-Object { $_.seatId -eq $seatId }
Write-Host "Seat $seatId status: $($bookedSeat.seatStatus)" -ForegroundColor Cyan
if ($bookedSeat.seatStatus -eq "BOOKED") {
    Write-Host "PASS: Seat correctly marked as BOOKED" -ForegroundColor Green
} else {
    Write-Host "FAIL: Expected BOOKED but got $($bookedSeat.seatStatus)" -ForegroundColor Red
}

# PHASE 7: Test not found errors
Write-Host "`n--- 7. Test error cases ---"

# Non-existent seat
Write-Host "7a. Reserve non-existent seat (expect 404)..."
try {
    Invoke-RestMethod -Uri "$baseUrl/api/reservations" -Method Post -Headers $headers -ContentType "application/json" -Body '{"eventSeatId":99999}'
    Write-Host "FAIL: Should reject" -ForegroundColor Red
} catch {
    $code = $_.Exception.Response.StatusCode.value__
    if ($code -eq 404) {
        Write-Host "PASS: Rejected with 404" -ForegroundColor Green
    } else {
        Write-Host "FAIL: Got $code" -ForegroundColor Red
    }
}

# Non-existent reservation for booking
Write-Host "7b. Book non-existent reservation (expect 404)..."
try {
    Invoke-RestMethod -Uri "$baseUrl/api/bookings" -Method Post -Headers $headers -ContentType "application/json" -Body '{"reservationId":99999}'
    Write-Host "FAIL: Should reject" -ForegroundColor Red
} catch {
    $code = $_.Exception.Response.StatusCode.value__
    if ($code -eq 404) {
        Write-Host "PASS: Rejected with 404" -ForegroundColor Green
    } else {
        Write-Host "FAIL: Got $code" -ForegroundColor Red
    }
}

# PHASE 8: Race condition test
Write-Host "`n--- 8. Race condition test ---"
$seatsFresh = Invoke-RestMethod -Uri "$baseUrl/api/events/1/seats" -Method Get
$raceSeats = $seatsFresh | Where-Object { $_.seatStatus -eq "AVAILABLE" }
if ($raceSeats.Count -gt 0) {
    $raceSeatId = $raceSeats[0].seatId
    Write-Host "Testing race on seatId=$raceSeatId" -ForegroundColor Cyan
    
    $job1 = Start-Job -ScriptBlock {
        param($seatId, $token, $url)
        $h = @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" }
        $b = "{`"eventSeatId`":$seatId}"
        try {
            $r = Invoke-RestMethod -Uri $url -Method Post -Headers $h -Body $b
            return @{ success = $true; data = $r }
        } catch {
            return @{ success = $false; code = $_.Exception.Response.StatusCode.value__; err = $_.Exception.Message }
        }
    } -ArgumentList $raceSeatId, $token, "$baseUrl/api/reservations"
    
    $job2 = Start-Job -ScriptBlock {
        param($seatId, $token, $url)
        $h = @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" }
        $b = "{`"eventSeatId`":$seatId}"
        try {
            $r = Invoke-RestMethod -Uri $url -Method Post -Headers $h -Body $b
            return @{ success = $true; data = $r }
        } catch {
            return @{ success = $false; code = $_.Exception.Response.StatusCode.value__; err = $_.Exception.Message }
        }
    } -ArgumentList $raceSeatId, $token, "$baseUrl/api/reservations"
    
    $res1 = Receive-Job $job1 -Wait
    $res2 = Receive-Job $job2 -Wait
    Remove-Job $job1
    Remove-Job $job2
    
    $s1 = if ($res1.success) { "SUCCESS" } else { "FAILED ($($res1.code))" }
    $s2 = if ($res2.success) { "SUCCESS" } else { "FAILED ($($res2.code))" }
    Write-Host "Job1: $s1, Job2: $s2" -ForegroundColor Cyan
    
    if ($res1.success -and $res2.success) {
        Write-Host "FAIL: RACE CONDITION! Both succeeded!" -ForegroundColor Red
    } elseif ($res1.success -xor $res2.success) {
        Write-Host "PASS: Only one succeeded (no race)" -ForegroundColor Green
    } else {
        Write-Host "Both failed (unexpected)" -ForegroundColor Yellow
    }
} else {
    Write-Host "SKIP: No seats for race test" -ForegroundColor Yellow
}

Write-Host "`n=== TEST COMPLETE ===" -ForegroundColor Green

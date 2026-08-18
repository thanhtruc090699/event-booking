$baseUrl = "http://localhost:8080"

Write-Host "=== 1. Get available seats for event 1 ==="
$seatsBefore = Invoke-RestMethod -Uri "$baseUrl/api/events/1/seats" -Method Get
$seatsBefore | Format-Table

$availableSeats = $seatsBefore | Where-Object { $_.seatStatus -eq "AVAILABLE" }
if ($availableSeats.Count -lt 1) {
    Write-Host "ERROR: Need at least 1 available seat to run this test" -ForegroundColor Red
    exit 1
}

$seatId1 = $availableSeats[0].seatId
$seatId2 = $null
if ($availableSeats.Count -ge 2) {
    $seatId2 = $availableSeats[1].seatId
}

Write-Host "`n=== 2. Create reservation for customer 1 / seatId $seatId1 ==="
$reservation1 = Invoke-RestMethod `
    -Uri "$baseUrl/api/reservations" `
    -Method Post `
    -ContentType "application/json" `
    -Body (@{
        eventSeatId = $seatId1
        customerId = 1
    } | ConvertTo-Json)

$reservation1 | Format-List

Write-Host "`n=== 3. Try to reserve same seat again - should return 409 ==="
try {
    Invoke-RestMethod `
        -Uri "$baseUrl/api/reservations" `
        -Method Post `
        -ContentType "application/json" `
        -Body (@{
            eventSeatId = $seatId1
            customerId = 2
        } | ConvertTo-Json)

    Write-Host "ERROR: Expected 409 but request succeeded" -ForegroundColor Red
}
catch {
    Write-Host "Expected error received:" -ForegroundColor Yellow
    Write-Host $_.Exception.Message
}

Write-Host "`n=== 4. Create booking for reservation $($reservation1.reservationId) ==="
$booking1 = Invoke-RestMethod `
    -Uri "$baseUrl/api/bookings" `
    -Method Post `
    -ContentType "application/json" `
    -Body (@{
        reservationId = $reservation1.reservationId
        customerId = 1
    } | ConvertTo-Json)

$booking1 | Format-List

if ($null -ne $seatId2) {
    Write-Host "`n=== 5. Create reservation for customer 2 / seatId $seatId2 ==="
    $reservation2 = Invoke-RestMethod `
        -Uri "$baseUrl/api/reservations" `
        -Method Post `
        -ContentType "application/json" `
        -Body (@{
            eventSeatId = $seatId2
            customerId = 2
        } | ConvertTo-Json)

    $reservation2 | Format-List

    Write-Host "`n=== 6. Create booking for reservation $($reservation2.reservationId) ==="
    $booking2 = Invoke-RestMethod `
        -Uri "$baseUrl/api/bookings" `
        -Method Post `
        -ContentType "application/json" `
        -Body (@{
            reservationId = $reservation2.reservationId
            customerId = 2
        } | ConvertTo-Json)

    $booking2 | Format-List
} else {
    Write-Host "`n=== 5-6. SKIP: Only one available seat, using it for race condition test later ===" -ForegroundColor Yellow
}

Write-Host "`n=== 7. Get seats after booking ==="
$seatsAfter = Invoke-RestMethod -Uri "$baseUrl/api/events/1/seats" -Method Get
$seatsAfter | Format-Table

Write-Host "`n=== 8. ERROR TEST: Reserve non-existent seat ==="
try {
    Invoke-RestMethod `
        -Uri "$baseUrl/api/reservations" `
        -Method Post `
        -ContentType "application/json" `
        -Body (@{
            eventSeatId = 99999
            customerId = 1
        } | ConvertTo-Json)

    Write-Host "ERROR: Expected error but request succeeded" -ForegroundColor Red
}
catch {
    Write-Host "Expected error received:" -ForegroundColor Yellow
    Write-Host $_.Exception.Message
}

Write-Host "`n=== 9. ERROR TEST: Create booking with wrong customerId ==="
try {
    Invoke-RestMethod `
        -Uri "$baseUrl/api/bookings" `
        -Method Post `
        -ContentType "application/json" `
        -Body (@{
            reservationId = $reservation1.reservationId
            customerId = 999
        } | ConvertTo-Json)

    Write-Host "ERROR: Expected error but request succeeded" -ForegroundColor Red
}
catch {
    Write-Host "Expected error received:" -ForegroundColor Yellow
    Write-Host $_.Exception.Message
}

Write-Host "`n=== 10. ERROR TEST: Create booking for non-existent reservation ==="
try {
    Invoke-RestMethod `
        -Uri "$baseUrl/api/bookings" `
        -Method Post `
        -ContentType "application/json" `
        -Body (@{
            reservationId = 99999
            customerId = 1
        } | ConvertTo-Json)

    Write-Host "ERROR: Expected error but request succeeded" -ForegroundColor Red
}
catch {
    Write-Host "Expected error received:" -ForegroundColor Yellow
    Write-Host $_.Exception.Message
}

Write-Host "`n=== 11. ERROR TEST: Create booking for already confirmed reservation ==="
try {
    Invoke-RestMethod `
        -Uri "$baseUrl/api/bookings" `
        -Method Post `
        -ContentType "application/json" `
        -Body (@{
            reservationId = $reservation1.reservationId
            customerId = 1
        } | ConvertTo-Json)

    Write-Host "ERROR: Expected error but request succeeded" -ForegroundColor Red
}
catch {
    Write-Host "Expected error received:" -ForegroundColor Yellow
    Write-Host $_.Exception.Message
}

Write-Host "`n=== 12. RACE CONDITION TEST: Concurrent reservations for same seat ==="
$availableSeatsAfter = Invoke-RestMethod -Uri "$baseUrl/api/events/1/seats" -Method Get
$availableSeat = $availableSeatsAfter | Where-Object { $_.seatStatus -eq "AVAILABLE" } | Select-Object -First 1

if ($null -ne $availableSeat) {
    $raceSeatId = $availableSeat.seatId
    Write-Host "Testing race condition on seatId $raceSeatId" -ForegroundColor Cyan

    $body1 = @{ eventSeatId = $raceSeatId; customerId = 100 } | ConvertTo-Json
    $body2 = @{ eventSeatId = $raceSeatId; customerId = 200 } | ConvertTo-Json

    $job1 = Start-Job -ScriptBlock {
        param($body, $url)
        try {
            $result = Invoke-RestMethod -Uri $url -Method Post -ContentType "application/json" -Body $body
            return @{ success = $true; data = $result }
        } catch {
            return @{ success = $false; error = $_.Exception.Message }
        }
    } -ArgumentList $body1, "$baseUrl/api/reservations"

    $job2 = Start-Job -ScriptBlock {
        param($body, $url)
        try {
            $result = Invoke-RestMethod -Uri $url -Method Post -ContentType "application/json" -Body $body
            return @{ success = $true; data = $result }
        } catch {
            return @{ success = $false; error = $_.Exception.Message }
        }
    } -ArgumentList $body2, "$baseUrl/api/reservations"

    $result1 = Receive-Job $job1 -Wait
    $result2 = Receive-Job $job2 -Wait

    Remove-Job $job1
    Remove-Job $job2

    Write-Host "Request 1 result:" -ForegroundColor Cyan
    if ($result1.success) {
        Write-Host "  SUCCESS - reservationId: $($result1.data.reservationId)" -ForegroundColor Green
    } else {
        Write-Host "  FAILED - $($result1.error)" -ForegroundColor Yellow
    }

    Write-Host "Request 2 result:" -ForegroundColor Cyan
    if ($result2.success) {
        Write-Host "  SUCCESS - reservationId: $($result2.data.reservationId)" -ForegroundColor Green
    } else {
        Write-Host "  FAILED - $($result2.error)" -ForegroundColor Yellow
    }

    if ($result1.success -and $result2.success) {
        Write-Host "RACE CONDITION DETECTED! Both requests succeeded!" -ForegroundColor Red
    } elseif ($result1.success -xor $result2.success) {
        Write-Host "PASS: Only one request succeeded as expected" -ForegroundColor Green
    } else {
        Write-Host "Both requests failed (unexpected)" -ForegroundColor Yellow
    }
} else {
    Write-Host "SKIP: No available seats for race condition test" -ForegroundColor Yellow
}

Write-Host "`n=== Test completed ===" -ForegroundColor Green
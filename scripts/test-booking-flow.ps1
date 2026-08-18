$baseUrl = "http://localhost:8080"

Write-Host "=== 1. Get available seats for event 1 ==="
$seatsBefore = Invoke-RestMethod -Uri "$baseUrl/api/events/1/seats" -Method Get
$seatsBefore | Format-Table

$availableSeats = $seatsBefore | Where-Object { $_.seatStatus -eq "AVAILABLE" }
if ($availableSeats.Count -lt 2) {
    Write-Host "ERROR: Need at least 2 available seats to run this test" -ForegroundColor Red
    exit 1
}

$seatId1 = $availableSeats[0].seatId
$seatId2 = $availableSeats[1].seatId

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

Write-Host "`n=== Test completed ===" -ForegroundColor Green
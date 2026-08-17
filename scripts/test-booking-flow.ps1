$baseUrl = "http://localhost:8080"

Write-Host "=== 1. Get seats for event 1 ==="
$seatsBefore = Invoke-RestMethod -Uri "$baseUrl/api/events/1/seats" -Method Get
$seatsBefore | Format-Table

Write-Host "`n=== 2. Create reservation for customer 1 / eventSeatId 1001 ==="
$reservation1 = Invoke-RestMethod `
    -Uri "$baseUrl/api/reservations" `
    -Method Post `
    -ContentType "application/json" `
    -Body (@{
        eventSeatId = 1001
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
            eventSeatId = 1001
            customerId = 1
        } | ConvertTo-Json)

    Write-Host "ERROR: Expected 409 but request succeeded" -ForegroundColor Red
}
catch {
    Write-Host "Expected error received:" -ForegroundColor Yellow
    Write-Host $_.Exception.Message
}

Write-Host "`n=== 4. Create booking for reservation 1 ==="
$booking1 = Invoke-RestMethod `
    -Uri "$baseUrl/api/bookings" `
    -Method Post `
    -ContentType "application/json" `
    -Body (@{
        reservationId = $reservation1.reservationId
        customerId = 1
    } | ConvertTo-Json)

$booking1 | Format-List

Write-Host "`n=== 5. Create reservation for customer 2 / eventSeatId 1002 ==="
$reservation2 = Invoke-RestMethod `
    -Uri "$baseUrl/api/reservations" `
    -Method Post `
    -ContentType "application/json" `
    -Body (@{
        eventSeatId = 1002
        customerId = 2
    } | ConvertTo-Json)

$reservation2 | Format-List

Write-Host "`n=== 6. Create booking for reservation 2 ==="
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

Write-Host "`n=== Test completed ===" -ForegroundColor Green
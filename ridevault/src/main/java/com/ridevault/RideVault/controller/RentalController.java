package com.ridevault.RideVault.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ridevault.RideVault.entity.Rental;
import com.ridevault.RideVault.entity.Vehicle;
import com.ridevault.RideVault.repository.RentalRepository;
import com.ridevault.RideVault.repository.VehicleRepository;

@RestController
public class RentalController {

    private final RentalRepository rentalRepository;
    private final VehicleRepository vehicleRepository;

    public RentalController(RentalRepository rentalRepository,
                            VehicleRepository vehicleRepository) {
        this.rentalRepository = rentalRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @GetMapping("/rentals")
    public List<Rental> getAllRentals() {
        return rentalRepository.findAll();
    }

    @PostMapping("/rentals")
    public Rental addRental(@RequestBody Rental rental) {

        Vehicle vehicle = vehicleRepository.findById(rental.getVehicleId()).orElse(null);

        if (vehicle == null) {
            return null;
        }

        if (!vehicle.isAvailable()) {
            return null;
        }

        vehicle.setAvailable(false);
        vehicleRepository.save(vehicle);

        return rentalRepository.save(rental);
    }

    @PutMapping("/rentals/{id}")
    public Rental updateRental(@PathVariable Long id, @RequestBody Rental rental) {

        Rental existingRental = rentalRepository.findById(id).orElse(null);

        if (existingRental == null) {
            return null;
        }

        existingRental.setCustomerId(rental.getCustomerId());
        existingRental.setVehicleId(rental.getVehicleId());
        existingRental.setStartDate(rental.getStartDate());
        existingRental.setEndDate(rental.getEndDate());
        existingRental.setTotalPrice(rental.getTotalPrice());

        return rentalRepository.save(existingRental);
    }

    @DeleteMapping("/rentals/{id}")
    public String deleteRental(@PathVariable Long id) {

        Rental rental = rentalRepository.findById(id).orElse(null);

        if (rental == null) {
            return "Rental not found";
        }

        Vehicle vehicle = vehicleRepository.findById(rental.getVehicleId()).orElse(null);

        if (vehicle != null) {
            vehicle.setAvailable(true);
            vehicleRepository.save(vehicle);
        }

        rentalRepository.deleteById(id);

        return "Rental deleted successfully";
    }
}
package com.ridevault.RideVault.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ridevault.RideVault.entity.Vehicle;
import com.ridevault.RideVault.repository.VehicleRepository;

@RestController
@RequestMapping("/vehicles")
@CrossOrigin(origins = "http://localhost:5173")
public class VehicleController {

    @Autowired
    private VehicleRepository vehicleRepository;


    // ================================
    // GET ALL VEHICLES
    // ================================

    @GetMapping
    public List<Vehicle> getAllVehicles() {

        return vehicleRepository.findAll();
    }


    // ================================
    // GET VEHICLE BY ID
    // ================================

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getVehicleById(
            @PathVariable Long id) {

        return vehicleRepository.findById(id)
                .map(vehicle ->
                        ResponseEntity.ok(vehicle))
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }


    // ================================
    // ADD VEHICLE
    // ================================

    @PostMapping
    public Vehicle addVehicle(
            @RequestBody Vehicle vehicle) {

        return vehicleRepository.save(vehicle);
    }


    // ================================
    // UPDATE VEHICLE
    // ================================

    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> updateVehicle(
            @PathVariable Long id,
            @RequestBody Vehicle vehicle) {

        return vehicleRepository.findById(id)
                .map(existingVehicle -> {

                    existingVehicle.setBrand(
                            vehicle.getBrand()
                    );

                    existingVehicle.setModel(
                            vehicle.getModel()
                    );

                    existingVehicle.setYear(
                            vehicle.getYear()
                    );

                    existingVehicle.setPricePerDay(
                            vehicle.getPricePerDay()
                    );

                    existingVehicle.setTransmission(
                            vehicle.getTransmission()
                    );

                    existingVehicle.setFuelType(
                            vehicle.getFuelType()
                    );

                    existingVehicle.setAvailable(
                            vehicle.isAvailable()
                    );

                    Vehicle updatedVehicle =
                            vehicleRepository.save(
                                    existingVehicle
                            );

                    return ResponseEntity.ok(
                            updatedVehicle
                    );
                })
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }


    // ================================
    // DELETE VEHICLE
    // ================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteVehicle(
            @PathVariable Long id) {

        if (!vehicleRepository.existsById(id)) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        vehicleRepository.deleteById(id);

        return ResponseEntity.ok(
                "Vehicle deleted successfully"
        );
    }
}
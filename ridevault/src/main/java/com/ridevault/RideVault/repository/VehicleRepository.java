package com.ridevault.RideVault.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ridevault.RideVault.entity.Vehicle;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
}

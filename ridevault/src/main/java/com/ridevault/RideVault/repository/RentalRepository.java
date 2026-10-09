package com.ridevault.RideVault.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ridevault.RideVault.entity.Rental;

public interface RentalRepository extends JpaRepository<Rental, Long> {
}
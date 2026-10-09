package com.ridevault.RideVault.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ridevault.RideVault.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
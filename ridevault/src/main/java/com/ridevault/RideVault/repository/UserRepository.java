package com.ridevault.RideVault.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ridevault.RideVault.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}
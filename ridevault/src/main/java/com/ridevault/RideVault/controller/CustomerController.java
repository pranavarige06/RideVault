package com.ridevault.RideVault.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ridevault.RideVault.entity.Customer;
import com.ridevault.RideVault.repository.CustomerRepository;

@RestController
public class CustomerController {

    private final CustomerRepository customerRepository;

    public CustomerController(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @GetMapping("/customers")
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @PostMapping("/customers")
    public Customer addCustomer(@RequestBody Customer customer) {
        return customerRepository.save(customer);
    }

@PutMapping("/customers/{id}")
public Customer updateCustomer(@PathVariable Long id, @RequestBody Customer customer) {

    Customer existingCustomer = customerRepository.findById(id).orElse(null);

    if (existingCustomer == null) {
        return null;
    }

    existingCustomer.setName(customer.getName());
    existingCustomer.setEmail(customer.getEmail());
    existingCustomer.setPhone(customer.getPhone());

    return customerRepository.save(existingCustomer);
}
@DeleteMapping("/customers/{id}")
public String deleteCustomer(@PathVariable Long id) {

    if (!customerRepository.existsById(id)) {
        return "Customer not found";
    }

    customerRepository.deleteById(id);
    return "Customer deleted successfully";
}
}
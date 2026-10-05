package com.bakery.config;

import com.bakery.entity.Product;
import com.bakery.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner seedProducts(ProductRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(new Product("Chocolate Cake", "Rich chocolate cake", 600, "Cake", true));
                repository.save(new Product("Red Velvet Cake", "Soft red velvet cake", 750, "Cake", true));
                repository.save(new Product("Brownie Box", "Box of delicious brownies", 300, "Brownies", true));
                repository.save(new Product("Cupcake", "Fresh cream cupcake", 80, "Cupcake", true));
            }
        };
    }
}

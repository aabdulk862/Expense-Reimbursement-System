package com.revature.P1Backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.revature.models") //This tells Spring to look in the models package for DB entities
@ComponentScan("com.revature") //This tells Spring to look in com.revature for Beans (stereotype annotations)
@EnableJpaRepositories("com.revature.repository") //This tells Spring to look in the repository package for JPA Repositories
public class P1BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(P1BackendApplication.class, args);
		System.out.println("Welcome to our Employee Reimbursement System");
	}

}

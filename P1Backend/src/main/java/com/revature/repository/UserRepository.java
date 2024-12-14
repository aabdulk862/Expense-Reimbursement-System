package com.revature.repository;

import com.revature.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

//JpaRepository takes two generics:
//-The type of the Entity we're working with
//-The type of the primary key of that Entity

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
}

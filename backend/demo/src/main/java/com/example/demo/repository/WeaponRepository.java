package com.example.demo.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.example.demo.entity.Weapon;

@RepositoryRestResource(path = "weapons", exported = false)
public interface WeaponRepository extends CrudRepository<Weapon, Long> {

    List<Weapon> findByNombreContainingIgnoreCase(String nombre);
}

package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.example.demo.entity.WeaponType;

@RepositoryRestResource(path = "weapon-types", exported = false)
public interface WeaponTypeRepository extends CrudRepository<WeaponType, Long> {

	Optional<WeaponType> findByNombre(String nombre);
}

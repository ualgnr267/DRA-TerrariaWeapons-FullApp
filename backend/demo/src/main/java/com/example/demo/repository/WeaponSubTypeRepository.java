package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.example.demo.entity.WeaponSubType;
import com.example.demo.entity.WeaponType;

@RepositoryRestResource(path = "weapon-subtypes", exported = false)
public interface WeaponSubTypeRepository extends CrudRepository<WeaponSubType, Long> {

	Optional<WeaponSubType> findByNombreAndType(String nombre, WeaponType type);
}

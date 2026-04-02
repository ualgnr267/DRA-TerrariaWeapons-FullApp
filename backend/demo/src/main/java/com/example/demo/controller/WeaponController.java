package com.example.demo.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.WeaponDto;
import com.example.demo.entity.Weapon;
import com.example.demo.repository.WeaponRepository;

@RestController
@RequestMapping("/weapons")
@CrossOrigin(origins = "*")
public class WeaponController {

    private final WeaponRepository weaponRepository;

    public WeaponController(WeaponRepository weaponRepository) {
        this.weaponRepository = weaponRepository;
    }

    @GetMapping
    public List<WeaponDto> getAllWeapons() {
        List<WeaponDto> result = new ArrayList<>();
        Iterable<Weapon> allWeapons = weaponRepository.findAll();
        for (Weapon weapon : allWeapons) {
            result.add(WeaponDto.fromEntity(weapon));
        }
        return result;
    }

    @GetMapping("/{id}")
    public ResponseEntity<WeaponDto> getWeaponById(@PathVariable Long id) {
        return weaponRepository.findById(id)
                .map(weapon -> ResponseEntity.ok(WeaponDto.fromEntity(weapon)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}

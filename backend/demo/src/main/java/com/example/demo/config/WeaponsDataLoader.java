package com.example.demo.config;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Iterator;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.demo.entity.GameMode;
import com.example.demo.entity.Weapon;
import com.example.demo.entity.WeaponSubType;
import com.example.demo.entity.WeaponType;
import com.example.demo.repository.WeaponRepository;
import com.example.demo.repository.WeaponSubTypeRepository;
import com.example.demo.repository.WeaponTypeRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class WeaponsDataLoader implements CommandLineRunner {

    private final WeaponRepository weaponRepository;
    private final WeaponTypeRepository weaponTypeRepository;
    private final WeaponSubTypeRepository weaponSubTypeRepository;
    private final ObjectMapper objectMapper;

    @Value("${terraria.weapons.json.path:../scripts/terraria-weapons.json}")
    private String weaponsJsonPath;

    public WeaponsDataLoader(WeaponRepository weaponRepository,
                             WeaponTypeRepository weaponTypeRepository,
                             WeaponSubTypeRepository weaponSubTypeRepository,
                             ObjectMapper objectMapper) {
        this.weaponRepository = weaponRepository;
        this.weaponTypeRepository = weaponTypeRepository;
        this.weaponSubTypeRepository = weaponSubTypeRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(String... args) throws Exception {
        if (weaponRepository.count() > 0) {
            return;
        }

        Path path = Paths.get(weaponsJsonPath).toAbsolutePath().normalize();
        if (!Files.exists(path)) {
            System.err.println("Weapons JSON file not found at " + path);
            return;
        }

        try (InputStream inputStream = Files.newInputStream(path)) {
            JsonNode root = objectMapper.readTree(inputStream);
            loadFromJson(root);
        } catch (IOException e) {
            System.err.println("Error reading weapons JSON: " + e.getMessage());
        }
    }

    private void loadFromJson(JsonNode root) {
        Iterator<String> typeNames = root.fieldNames();
        while (typeNames.hasNext()) {
            String typeName = typeNames.next();
            JsonNode typeNode = root.get(typeName);
            if (typeNode == null || !typeNode.isObject()) {
                continue;
            }

            WeaponType type = weaponTypeRepository.findByNombre(typeName)
                    .orElseGet(() -> {
                        WeaponType newType = new WeaponType();
                        newType.setNombre(typeName);
                        return weaponTypeRepository.save(newType);
                    });

            JsonNode directWeaponsNode = typeNode.get("armas");
            if (directWeaponsNode != null && directWeaponsNode.isArray()) {
                for (JsonNode weaponNode : directWeaponsNode) {
                    createWeaponFromJson(weaponNode, type, null, null);
                }
            }

            JsonNode modosNode = typeNode.get("modos");
            if (modosNode != null && modosNode.isArray()) {
                for (JsonNode modoNode : modosNode) {
                    String modeName = modoNode.path("nombre").asText("");
                    GameMode gameMode = mapGameMode(modeName);

                    JsonNode subtypesNode = modoNode.get("subtipos");
                    if (subtypesNode != null && subtypesNode.isArray()) {
                        for (JsonNode subtypeNode : subtypesNode) {
                            String subtypeName = subtypeNode.path("nombre").asText("");
                            if (subtypeName.isEmpty()) {
                                continue;
                            }

                            WeaponSubType subType = weaponSubTypeRepository
                                    .findByNombreAndType(subtypeName, type)
                                    .orElseGet(() -> {
                                        WeaponSubType newSubType = new WeaponSubType();
                                        newSubType.setNombre(subtypeName);
                                        newSubType.setType(type);
                                        return weaponSubTypeRepository.save(newSubType);
                                    });

                            JsonNode subtypeWeaponsNode = subtypeNode.get("armas");
                            if (subtypeWeaponsNode != null && subtypeWeaponsNode.isArray()) {
                                for (JsonNode weaponNode : subtypeWeaponsNode) {
                                    createWeaponFromJson(weaponNode, type, subType, gameMode);
                                }
                            }
                        }
                    }

                    JsonNode modeWeaponsNode = modoNode.get("armas");
                    if (modeWeaponsNode != null && modeWeaponsNode.isArray()) {
                        for (JsonNode weaponNode : modeWeaponsNode) {
                            createWeaponFromJson(weaponNode, type, null, gameMode);
                        }
                    }
                }
            }
        }
    }

    private GameMode mapGameMode(String modeName) {
        String lower = modeName.toLowerCase();
        if (lower.contains("pre-hardmode")) {
            return GameMode.PRE_HARDMODE;
        }
        return GameMode.HARDMODE;
    }

    private void createWeaponFromJson(JsonNode weaponNode,
                                      WeaponType type,
                                      WeaponSubType subType,
                                      GameMode gameMode) {
        if (weaponNode == null || !weaponNode.isObject()) {
            return;
        }

        String nombre = weaponNode.path("nombre").asText(null);
        if (nombre == null || nombre.isBlank()) {
            return;
        }
        String imagen = weaponNode.path("imagen").asText(null);

        Weapon weapon = new Weapon();
        weapon.setNombre(nombre);
        weapon.setImagen(imagen);
        weapon.setModo(gameMode);
        weapon.setType(type);
        weapon.setSubType(subType);

        weaponRepository.save(weapon);
    }
}

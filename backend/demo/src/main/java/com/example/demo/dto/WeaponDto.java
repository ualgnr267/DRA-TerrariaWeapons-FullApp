package com.example.demo.dto;

import com.example.demo.entity.Weapon;

public class WeaponDto {

    private Long id;
    private String name;
    private String image;
    private String category;
    private String mode;
    private String subtype;

    public WeaponDto() {
    }

    public WeaponDto(Long id, String name, String image, String category, String mode, String subtype) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.category = category;
        this.mode = mode;
        this.subtype = subtype;
    }

    public static WeaponDto fromEntity(Weapon weapon) {
        String category = weapon.getType() != null ? weapon.getType().getNombre() : null;
        String subtype = weapon.getSubType() != null ? weapon.getSubType().getNombre() : null;
        String mode = weapon.getModo() != null ? weapon.getModo().name() : null;

        return new WeaponDto(
                weapon.getId(),
                weapon.getNombre(),
                weapon.getImagen(),
                category,
                mode,
                subtype
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public String getSubtype() {
        return subtype;
    }

    public void setSubtype(String subtype) {
        this.subtype = subtype;
    }
}

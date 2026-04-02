package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "weapons")
public class Weapon {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotBlank
    private String nombre;

    private String imagen;

    @Enumerated(EnumType.STRING)
    private GameMode modo;

    @ManyToOne
    @JoinColumn(name = "type_id")
    private WeaponType type;

    @ManyToOne
    @JoinColumn(name = "subtype_id")
    private WeaponSubType subType;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public GameMode getModo() {
        return modo;
    }

    public void setModo(GameMode modo) {
        this.modo = modo;
    }

    public WeaponType getType() {
        return type;
    }

    public void setType(WeaponType type) {
        this.type = type;
    }

    public WeaponSubType getSubType() {
        return subType;
    }

    public void setSubType(WeaponSubType subType) {
        this.subType = subType;
    }
}

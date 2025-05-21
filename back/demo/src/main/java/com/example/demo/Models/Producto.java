package com.example.demo.Models;


public class Producto {
    private String id;
    private String nombre;
    private double precio;
    private int stock;

    // Constructor vacío
    public Producto() {}

    public Producto(String id, String nombre, int stock, double precio) {
        this.id = id;
        this.nombre = nombre;
        this.stock = stock;
        this.precio = precio;
    }

    // Getters y Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public double getPrecio() { return precio; }
    public void setPrecio(double precio) { this.precio = precio; }

    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }
}

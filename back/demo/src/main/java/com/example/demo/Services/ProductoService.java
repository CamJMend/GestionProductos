package com.example.demo.Services;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.example.demo.Models.Producto;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class ProductoService {

    // Método para obtener productos
    public List<Producto> obtenerProductos() throws InterruptedException, ExecutionException {
        Firestore db = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> future = db.collection("productos").get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        List<Producto> productos = new ArrayList<>();
        for (QueryDocumentSnapshot doc : documents) {
            Producto p = doc.toObject(Producto.class);
            p.setId(doc.getId());
            productos.add(p);
        }

        return productos;
    }
    
    // Método para obtener un producto por ID
    public Producto obtenerProductoPorId(String id) throws InterruptedException, ExecutionException {
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference docRef = db.collection("productos").document(id);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot document = future.get();
        
        if (document.exists()) {
            Producto producto = document.toObject(Producto.class);
            producto.setId(document.getId());
            return producto;
        } else {
            return null;
        }
    }

    // Método para crear un producto
    public String crearProducto(Producto producto) throws InterruptedException, ExecutionException {
        Firestore db = FirestoreClient.getFirestore();
        // Si no tiene ID, se generará uno automáticamente
        DocumentReference docRef;
        if (producto.getId() == null || producto.getId().isEmpty()) {
            docRef = db.collection("productos").document();
            producto.setId(docRef.getId());
        } else {
            docRef = db.collection("productos").document(producto.getId());
        }
        
        ApiFuture<WriteResult> future = docRef.set(producto);
        future.get();  // Esperar a que se complete la creación
        
        return producto.getId();
    }

    // Método para actualizar un producto
    public Producto updateProducto(String id, Producto producto) throws InterruptedException, ExecutionException {
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference docRef = db.collection("productos").document(id);
        ApiFuture<WriteResult> future = docRef.set(producto);
        future.get();  // Esperar a que se complete la actualización
        return producto;
    }

    // Método para eliminar un producto
    public void deleteProducto(String id) throws InterruptedException, ExecutionException {
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference docRef = db.collection("productos").document(id);
        ApiFuture<WriteResult> future = docRef.delete();
        future.get();  // Esperar a que se complete la eliminación
    }
}
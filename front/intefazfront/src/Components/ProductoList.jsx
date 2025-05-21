import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, CircularProgress, TextField, Dialog, DialogActions, 
  DialogContent, DialogTitle, Box, Typography
} from '@mui/material';
import ProductoService from '../Services/ServiceProduct';

const ProductoList = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    nombre: '',
    precio: 0,
    stock: 0
  });

  // Fetch products on component mount
  useEffect(() => {
    loadProductos();
  }, []);

  // Function to load products
  const loadProductos = () => {
    setLoading(true);
    ProductoService.getProductos()
      .then(res => {
        setProductos(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading products", err);
        setError('Hubo un problema al obtener los productos');
        setLoading(false);
      });
  };

  // Function to delete a product
  const handleDelete = (id) => {
    if (window.confirm('¿Está seguro de eliminar este producto?')) {
      ProductoService.deleteProducto(id)
        .then(() => {
          setProductos(productos.filter(producto => producto.id !== id));
        })
        .catch(err => {
          console.error("Error deleting product", err);
          alert('Error al eliminar el producto');
        });
    }
  };

  // Function to open edit dialog
  const handleEditOpen = (product) => {
    setCurrentProduct(product);
    setIsEditDialogOpen(true);
  };

  // Function to close edit dialog
  const handleEditClose = () => {
    setIsEditDialogOpen(false);
    setCurrentProduct(null);
  };

  // Function to handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === 'precio' || name === 'stock' 
      ? parseFloat(value) 
      : value;
      
    setCurrentProduct({ ...currentProduct, [name]: updatedValue });
  };

  // Function to save edit changes
  const handleEditSubmit = () => {
    ProductoService.updateProducto(currentProduct.id, currentProduct)
      .then(() => {
        setProductos(productos.map(product => 
          product.id === currentProduct.id ? currentProduct : product
        ));
        handleEditClose();
      })
      .catch(err => {
        console.error("Error updating product", err);
        alert('Error al actualizar el producto');
      });
  };

  // Function to open add dialog
  const handleAddOpen = () => {
    setNewProduct({ nombre: '', precio: 0, stock: 0 });
    setIsAddDialogOpen(true);
  };

  // Function to close add dialog
  const handleAddClose = () => {
    setIsAddDialogOpen(false);
  };

  // Function to handle add form changes
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === 'precio' || name === 'stock' 
      ? parseFloat(value) 
      : value;
      
    setNewProduct({ ...newProduct, [name]: updatedValue });
  };

  // Function to save new product
  const handleAddSubmit = () => {
    // Basic validation
    if (!newProduct.nombre.trim()) {
      alert('El nombre del producto es obligatorio');
      return;
    }

    ProductoService.createProducto(newProduct)
      .then(() => {
        loadProductos(); // Reload all products to get the fresh list
        handleAddClose();
      })
      .catch(err => {
        console.error("Error creating product", err);
        alert('Error al crear el producto');
      });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      {error && (
        <Typography color="error" variant="body1" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Lista de Productos</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleAddOpen}
        >
          Agregar Producto
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No hay productos para mostrar
                </TableCell>
              </TableRow>
            ) : (
              productos.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.nombre}</TableCell>
                  <TableCell>${p.precio.toFixed(2)}</TableCell>
                  <TableCell>{p.stock}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditOpen(p)}
                      sx={{ mr: 1 }}
                    >
                      Actualizar
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(p.id)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Product Dialog */}
      {currentProduct && (
        <Dialog open={isEditDialogOpen} onClose={handleEditClose}>
          <DialogTitle>Actualizar Producto</DialogTitle>
          <DialogContent>
            <TextField
              label="Nombre"
              name="nombre"
              value={currentProduct.nombre}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Precio"
              name="precio"
              type="number"
              value={currentProduct.precio}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
              inputProps={{ min: 0, step: 0.01 }}
            />
            <TextField
              label="Stock"
              name="stock"
              type="number"
              value={currentProduct.stock}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
              inputProps={{ min: 0 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleEditSubmit} color="primary">
              Actualizar
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onClose={handleAddClose}>
        <DialogTitle>Agregar Nuevo Producto</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            name="nombre"
            value={newProduct.nombre}
            onChange={handleAddChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Precio"
            name="precio"
            type="number"
            value={newProduct.precio}
            onChange={handleAddChange}
            fullWidth
            margin="normal"
            inputProps={{ min: 0, step: 0.01 }}
          />
          <TextField
            label="Stock"
            name="stock"
            type="number"
            value={newProduct.stock}
            onChange={handleAddChange}
            fullWidth
            margin="normal"
            inputProps={{ min: 0 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleAddSubmit} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductoList;
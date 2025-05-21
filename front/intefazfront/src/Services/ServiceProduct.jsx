import axios from 'axios';

const API_URL = 'http://localhost:8080/api/productos';

class ServiceProduct {
  getProductos() {
    return axios.get(API_URL);
  }

  getProductoById(id) {
    return axios.get(`${API_URL}/${id}`);
  }

  createProducto(producto) {
    return axios.post(API_URL, producto);
  }

  updateProducto(id, producto) {
    return axios.put(`${API_URL}/${id}`, producto);
  }

  deleteProducto(id) {
    return axios.delete(`${API_URL}/${id}`);
  }
}

export default new ServiceProduct();
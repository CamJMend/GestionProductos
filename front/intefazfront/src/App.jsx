import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import ProductoList from './Components/ProductoList';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import Home from './Components/Home';

function App() {
  return (
    <Router>
      <div>
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Gestión de Productos
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/about">
            About
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ marginTop: '64px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<ProductoList />} />
        </Routes>
      </Container>
      </div>
    </Router>
  );
}

export default App;
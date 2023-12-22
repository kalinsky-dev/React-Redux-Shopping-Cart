import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';

function App() {
  const showCart = useSelector((state) => state.ui.cartIsVisible);
  const cart = useSelector((state) => state.cart);

  // Override the existing cart data in the database with the latest cart data
  useEffect(() => {
    fetch('https://react-http-51b6e-default-rtdb.firebaseio.com/cart.json', {
      method: 'PUT',
      body: JSON.stringify(cart),
    });
  },[cart]);

  return (
    <Layout>
      {showCart && <Cart />}
      <Products />
    </Layout>
  );
}

export default App;

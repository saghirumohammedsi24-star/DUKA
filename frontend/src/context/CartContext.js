import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [orderNotes, setOrderNotes] = useState('');

    const addToCart = (product, quantity = 1, selected_attributes = {}, finalPrice = null) => {
        setCart((prev) => {
            const existing = prev.find((item) =>
                item.id === product.id &&
                JSON.stringify(item.selected_attributes || {}) === JSON.stringify(selected_attributes)
            );

            const itemPrice = finalPrice || product.price;

            if (existing) {
                // Check stock
                const newQty = existing.quantity + quantity;
                if (newQty > product.stock) {
                    alert(`Sorry, only ${product.stock} units available in stock.`);
                    return prev;
                }

                return prev.map((item) =>
                    (item.id === product.id && JSON.stringify(item.selected_attributes || {}) === JSON.stringify(selected_attributes))
                        ? { ...item, quantity: newQty }
                        : item
                );
            }

            if (quantity > product.stock) {
                alert(`Sorry, only ${product.stock} units available in stock.`);
                return prev;
            }

            return [...prev, { ...product, price: itemPrice, quantity, selected_attributes }];
        });
    };

    const removeFromCart = (productId, selected_attributes = {}) => {
        setCart((prev) => prev.filter((item) =>
            !(item.id === productId && JSON.stringify(item.selected_attributes || {}) === JSON.stringify(selected_attributes))
        ));
    };

    const updateQuantity = (productId, quantity, selected_attributes = {}) => {
        setCart((prev) =>
            prev.map((item) =>
                (item.id === productId && JSON.stringify(item.selected_attributes || {}) === JSON.stringify(selected_attributes))
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
        setOrderNotes('');
    };

    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, orderNotes, setOrderNotes }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);

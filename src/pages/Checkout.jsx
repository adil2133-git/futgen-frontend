import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartProvider';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import api from '../api/Axios';
import { toast } from 'sonner';
import GPAY from '../assets/gpay.png'
import PHONEPE from '../assets/phonepe.png'
import PAYTM from '../assets/paytm.png'
import BHIM from '../assets/bhim.png'

function Checkout() {
    const { cart, getCartTotal, clearCart, getItemTotal, parsePrice } = useCart();
    const [paymentMethod, setPaymentMethod] = useState("razorpay")
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        upiId: ''
    });

    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {

            const outOfStockItems = cart.filter(item => item.productId.stock === 0)

            if (outOfStockItems.length > 0) {
                toast.error("Some items are out of stock. Please remove them before checkout.");
                return;
            }

            const invalidQuantity = cart.filter(
                item => item.quantity > item.productId.stock
            )

            if (invalidQuantity.length > 0) {
                toast.error("Some items exceed available stock. Please adjust quantity.");
                return;
            }
            const orderPayload = {
                items: cart.map(item => ({
                    productId: item.productId._id,
                    quantity: item.quantity
                })),
                shippingAddress: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode
                },
                totalAmount: total
            };


            if (paymentMethod === "cod") {
                await api.post("/orders", {
                    ...orderPayload,
                    paymentMethod: "cod"
                });

                toast.success("Order placed with COD");
                clearCart();
                navigate("/orders");
                return;
            }


            const { data } = await api.post("/payment/create-order", {
                amount: total
            });

            const order = data.order;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY,
                amount: order.amount,
                currency: "INR",
                name: "FUTGEN",
                description: "Order Payment",
                order_id: order.id,

                handler: async function (response) {
                    try {
                        const res = await api.post("/payment/verify", {
                            ...response,
                            orderData: orderPayload
                        });

                        if (res.data.success) {
                            toast.success("Payment Successful!");
                            clearCart();
                            navigate("/orders");
                        } else {
                            toast.error("Payment verification failed");
                        }
                    } catch (err) {
                        console.error(err);
                        toast.error("Verification failed");
                    }
                },

                modal: {
                    ondismiss: function () {
                        toast.error("Payment cancelled");
                    }
                },

                prefill: {
                    name: formData.firstName,
                    email: formData.email,
                    contact: formData.phone
                },

                theme: {
                    color: "#000"
                }
            };
            console.log(import.meta.env.VITE_RAZORPAY_KEY)

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Payment failed");
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <>
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="text-center py-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">No Items to Checkout</h2>
                        <p className="text-gray-600 mb-8">Your cart is empty.</p>
                        <button onClick={() => navigate('/product')} className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold">
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </>
        );
    }

    const total = getCartTotal();

    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-2/3">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Shipping */}
                            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { label: 'First Name', name: 'firstName', type: 'text' },
                                        { label: 'Last Name', name: 'lastName', type: 'text' },
                                        { label: 'Email', name: 'email', type: 'email' },
                                        { label: 'Phone', name: 'phone', type: 'tel' },
                                    ].map(field => (
                                        <div key={field.name}>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">{field.label} *</label>
                                            <input
                                                type={field.type}
                                                name={field.name}
                                                value={formData[field.name]}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            />
                                        </div>
                                    ))}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                                        <input type="text" name="address" value={formData.address} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                                    </div>
                                    {[
                                        { label: 'City', name: 'city' },
                                        { label: 'State', name: 'state' },
                                        { label: 'ZIP Code', name: 'zipCode' },
                                    ].map(field => (
                                        <div key={field.name}>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">{field.label} *</label>
                                            <input type="text" name={field.name} value={formData[field.name]} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment */}
                            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>

                                <div className="space-y-4">

                                    {/* Razorpay */}
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="razorpay"
                                            checked={paymentMethod === "razorpay"}
                                            onChange={() => setPaymentMethod("razorpay")}
                                        />
                                        <span>Online Payment (UPI, Cards, Net Banking)</span>
                                    </label>

                                    {/* COD */}
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={paymentMethod === "cod"}
                                            onChange={() => setPaymentMethod("cod")}
                                        />
                                        <span>Cash on Delivery</span>
                                    </label>

                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Processing...' : `Pay ₹${total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 sticky top-4">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                            <div className="space-y-3 mb-6">
                                {cart.map((item) => (
                                    <div key={item.cartId || item._id} className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium text-gray-900">{item.productId.name}</p>
                                            <p className="text-sm text-gray-600">Size: {item.size} × {item.quantity}</p>
                                        </div>
                                        <p className="font-medium">₹{getItemTotal(item).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                                    </div>
                                ))}
                                <hr className="my-2" />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>₹{total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Checkout;
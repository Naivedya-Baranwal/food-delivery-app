import { useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { io } from 'socket.io-client';

const TrackOrder = () => {
  const { orderId } = useParams();
  const { url, token } = useContext(StoreContext);
  const [order, setOrder] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    // Fetch order details
    fetchOrderDetails();

    // Connect to socket for real-time updates
    const socket = io(url);
    
    socket.on('delivery_location_update', (data) => {
      setDeliveryLocation(data.location);
    });

    socket.on('order_status_update', (data) => {
      if (data.orderId === orderId) {
        fetchOrderDetails(); // Refresh order details
      }
    });

    return () => socket.disconnect();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`${url}/api/order/${orderId}`, {
        headers: { token }
      });
      setOrder(response.data.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    }
  };

  const getDirections = () => {
    if (!deliveryLocation || !order?.address) return;

    const directionsService = new google.maps.DirectionsService();
    
    directionsService.route({
      origin: deliveryLocation,
      destination: `${order.address.street}, ${order.address.city}`,
      travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => {
      if (status === 'OK') {
        setDirections(result);
      }
    });
  };

  useEffect(() => {
    if (deliveryLocation && order) {
      getDirections();
    }
  }, [deliveryLocation, order]);

  if (!order) return <div className="loading">Loading...</div>;

  return (
    <div className="track-order">
      <h2>Track Your Order</h2>
      
      <div className="order-info">
        <div className="status">
          <h3>Order Status: {order.status}</h3>
          <div className="progress-bar">
            <div className={`step ${order.status === 'Food Processing' || order.status === 'Out for Delivery' || order.status === 'Delivered' ? 'completed' : ''}`}>
              Food Processing
            </div>
            <div className={`step ${order.status === 'Out for Delivery' || order.status === 'Delivered' ? 'completed' : ''}`}>
              Out for Delivery
            </div>
            <div className={`step ${order.status === 'Delivered' ? 'completed' : ''}`}>
              Delivered
            </div>
          </div>
        </div>
      </div>

      {order.status === 'Out for Delivery' && (
        <div className="map-container">
          <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '400px' }}
              center={deliveryLocation || { lat: 28.6139, lng: 77.2090 }}
              zoom={13}
            >
              {deliveryLocation && <Marker position={deliveryLocation} title="Delivery Agent" />}
              {order.address && (
                <Marker 
                  position={{ 
                    lat: order.address.latitude || 28.6139, 
                    lng: order.address.longitude || 77.2090 
                  }} 
                  title="Your Location" 
                />
              )}
              {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
          </LoadScript>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;

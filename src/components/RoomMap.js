import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const RoomMap = ({ address }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView([21.028511, 105.804817], 13); // Vị trí mặc định: Hà Nội

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const geocodeAddress = async () => {
      const addressStr = `${address.ward}, ${address.district}, ${address.city}`;
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addressStr)}&format=json&limit=1`;
console.log('url:', url);
      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.length > 0) {
          const { lat, lon } = data[0];

          map.setView([lat, lon], 15);
          L.marker([lat, lon]).addTo(map).bindPopup(addressStr).openPopup();
          console.log('Vị trí:', lat, lon);
          console.log("Địa chỉ tìm kiếm:", addressStr);
        } else {
          console.error('Không tìm thấy vị trí');
        }
      } catch (err) {
        console.error('Lỗi khi tìm vị trí:', err);
      }
    };

    geocodeAddress();

    return () => {
      map.remove();
    };
  }, [address]);

  return <div id="map" ref={mapRef} style={{ height: '400px', width: '100%' }}></div>;
};

export default RoomMap;

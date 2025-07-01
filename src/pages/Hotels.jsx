import { useState, useEffect } from 'react';
import { getHotels, createHotel, updateHotel } from '../services/hotelService';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import AccommodationManager from '../components/AccommodationManager';


import HotelForm from '../components/HotelForm';


const Hotels = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [hotelToEdit, setHotelToEdit] = useState(null);


  const loadHotels = () => {
    getHotels().then(res => setHotels(res.data));
  };

  const goToAccommodations = (hotelId) => {
    navigate(`/hotels/${hotelId}`);
  };

  useEffect(() => {
    loadHotels();
  }, []);

  const handleCreateHotel = (formData) => {
    if (formData.id) {
      updateHotel(formData.id, formData).then(() => {
        loadHotels();
      });
    } else {
      createHotel(formData).then(() => {
        loadHotels();
      });
    }
  };

  const handleSuccess = () => {
    setHotelToEdit(null); 
    loadHotels(); 
  };

  return (
    <div className="p-4">
      <HotelForm onSubmit={handleCreateHotel} initialData={hotelToEdit}
        onSuccess={handleSuccess} />
      
      <hr className="my-4" />
      <div>
        <DataTable value={hotels} showGridlines tableStyle={{ minWidth: '50rem' }}>
            <Column field="name" header="Nombre Hotel"></Column>
            <Column field="address" header="Direccion"></Column>
            <Column field="city" header="Ciudad"></Column>
            <Column field="max_rooms" header="Numero de Habitaciones"></Column>
            <Column field='nit' header="Nit"></Column>
            <Column  header="Acciones" body={(rowData) => (
              <div className="flex gap-2">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-text"
                  onClick={() => setHotelToEdit(rowData)} />
                <Button icon="pi pi-cog" className="p-button-rounded p-button-text"
                      onClick={() => goToAccommodations(rowData.id)} />
              </div>
                )}
              />
            
        </DataTable>
      </div>

    </div>
  );
};

export default Hotels;

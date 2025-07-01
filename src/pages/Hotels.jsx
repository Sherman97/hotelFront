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
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Gestión de Hoteles</h1>
        
        <div style={styles.formContainer}>
          <HotelForm 
            onSubmit={handleCreateHotel} 
            initialData={hotelToEdit}
            onSuccess={handleSuccess} 
          />
        </div>

        <div style={styles.divider}></div>

        <div style={styles.tableContainer}>
          <h2 style={styles.subtitle}>Lista de Hoteles</h2>
          <DataTable 
            value={hotels} 
            showGridlines 
            style={styles.table}
            tableStyle={{ minWidth: '50rem' }}
          >
            <Column field="name" header="Nombre Hotel"></Column>
            <Column field="address" header="Dirección"></Column>
            <Column field="city" header="Ciudad"></Column>
            <Column field="max_rooms" header="N° Habitaciones"></Column>
            <Column field='nit' header="NIT"></Column>
            <Column header="Acciones" body={(rowData) => (
              <div style={styles.actions}>
                <Button 
                  icon="pi pi-pencil" 
                  className="p-button-rounded p-button-text"
                  onClick={() => setHotelToEdit(rowData)} 
                />
                <Button 
                  icon="pi pi-cog" 
                  className="p-button-rounded p-button-text"
                  onClick={() => goToAccommodations(rowData.id)} 
                />
              </div>
            )}/>

          </DataTable>
        </div>
      </div>
    </div>
  );
};



const styles = {
  container: {
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    minHeight: '100vh',
    padding: '2rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  content: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  title: {
    color: '#2c3e50',
    marginBottom: '1.5rem',
    textAlign: 'center'
  },
  formContainer: {
    marginBottom: '2rem'
  },
  divider: {
    height: '1px',
    backgroundColor: '#e0e0e0',
    margin: '1.5rem 0'
  },
  tableContainer: {
    marginTop: '2rem'
  },
  subtitle: {
    color: '#2c3e50',
    marginBottom: '1rem'
  },
  table: {
    backgroundColor: 'white'
  },
  actions: {
    display: 'flex',
    justifyContent: 'center'
  },
  actionButton: {
    color: '#4CAF50'
  }
};

export default Hotels;
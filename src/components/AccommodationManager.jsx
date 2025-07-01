import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import {
  getHotelAndAccommodations,
  getAccommodationsCatalog as getAccommodationOptions,
  getRoomTypesCatalog as getRoomTypes,
  createHotelRoom,
  updateHotelRoom,
  deleteHotelRoom
} from '../services/accommodationService';

export default function AccommodationManager({ hotelId: propHotelId }) {
  const navigate = useNavigate();
  const { hotelId: paramId } = useParams();
  const hotelId = propHotelId || paramId;
  const toast = useRef(null);

  const [hotelInfo, setHotelInfo] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [accommodationOptions, setAccommodationOptions] = useState([]);
  const [assignedAccommodations, setAssignedAccommodations] = useState([]);

  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [roomQuantity, setRoomQuantity] = useState(null);

  // Carga inicial de datos (sin cambios)
  useEffect(() => {
    if (!hotelId) return;

    getHotelAndAccommodations(hotelId)
      .then(res => {
        setHotelInfo(res.data.hotel);
        const normalized = res.data.accommodations.map(a => ({
          id: a.id,
          roomType: a.room_type,
          accommodation: a.accommodation,
          quantity: a.quantity
        }));
        setAssignedAccommodations(normalized);
      })
      .catch(err => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: err.message });
      });

    getAccommodationOptions()
      .then(res => setAccommodationOptions(res.data))
      .catch(err => toast.current.show({ severity: 'warn', summary: 'Catálogo', detail: err.message }));

    getRoomTypes()
      .then(res => setRoomTypes(res.data))
      .catch(err => toast.current.show({ severity: 'warn', summary: 'Catálogo', detail: err.message }));
  }, [hotelId]);

  // Recargar tabla (sin cambios)
  const reloadData = () => {
    getHotelAndAccommodations(hotelId)
      .then(res => {
        const normalized = res.data.accommodations.map(a => ({
          id: a.id,
          roomType: a.room_type,
          accommodation: a.accommodation,
          quantity: a.quantity
        }));
        setAssignedAccommodations(normalized);
      });
  };

  // handleSave, handleDelete (sin cambios en la lógica)
  const handleSave = () => {
    if (!selectedRoomType || !selectedAccommodation || !roomQuantity) {
      toast.current.show({ severity: 'warn', summary: 'Validación', detail: 'Todos los campos son obligatorios.' });
      return;
    }

    const payload = {
      room_type_id: selectedRoomType.id,
      accommodation_id: selectedAccommodation.id,
      quantity: roomQuantity
    };

    const existing = assignedAccommodations.find(a =>
      a.roomType.id === payload.room_type_id &&
      a.accommodation.id === payload.accommodation_id
    );

    const action = existing
      ? updateHotelRoom(hotelId, existing.id, payload)
      : createHotelRoom(hotelId, payload);

    action
      .then(() => {
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: existing ? 'Asignación actualizada.' : 'Asignación creada.' });
        reloadData();
        setSelectedRoomType(null);
        setSelectedAccommodation(null);
        setRoomQuantity(null);
      })
      .catch(err => {
        const msg = err.response?.data?.message || err.message;
        toast.current.show({ severity: 'error', summary: 'Error al guardar', detail: msg });
      });
  };

  const handleDelete = (row) => {
    deleteHotelRoom(hotelId, row.id)
      .then(() => {
        toast.current.show({ severity: 'info', summary: 'Eliminado', detail: 'Asignación removida.' });
        reloadData();
      })
      .catch(err => {
        toast.current.show({ severity: 'error', summary: 'Error al eliminar', detail: err.message });
      });
  };

  if (!hotelId) {
    return <div style={styles.noHotelMessage}>Selecciona un hotel para ver sus acomodaciones.</div>;
  }

  return (
    <div style={styles.container}>
      <Toast ref={toast} position="top-right" />

      {hotelInfo && (
        <div style={styles.hotelHeader}>
          <h3 style={styles.hotelName}>{hotelInfo.name}</h3>
          <p style={styles.hotelRooms}>Habitaciones totales: {hotelInfo.max_rooms}</p>
        </div>
      )}

      <div style={styles.formContainer}>
        <div style={styles.formRow}>
          <Dropdown
            value={selectedRoomType}
            onChange={e => setSelectedRoomType(e.value)}
            options={roomTypes}
            optionLabel="name"
            placeholder="Tipo de Cuarto"
            style={styles.dropdown}
          />
          <Dropdown
            value={selectedAccommodation}
            onChange={e => setSelectedAccommodation(e.value)}
            options={accommodationOptions}
            optionLabel="name"
            placeholder="Acomodación"
            style={styles.dropdown}
          />
          <InputNumber
            value={roomQuantity}
            onValueChange={e => setRoomQuantity(e.value)}
            placeholder="Cantidad"
            style={styles.inputNumber}
            min={1}
          />
        </div>

        <div style={styles.buttonGroup}>
          <Button 
            label="Guardar" 
            icon="pi pi-save" 
            onClick={handleSave} 
            style={styles.saveButton}
          />
          <Button
            label="Limpiar"
            icon="pi pi-times"
            onClick={() => {
              setSelectedRoomType(null);
              setSelectedAccommodation(null);
              setRoomQuantity(null);
            }}
            style={styles.clearButton}
          />
        </div>
      </div>

      <div style={styles.tableContainer}>
        <DataTable
          value={assignedAccommodations}
          showGridlines
          responsiveLayout="scroll"
          emptyMessage="No disponible"
          style={styles.dataTable}
        >
          <Column field="accommodation.name" header="Acomodación" style={styles.column} />
          <Column field="roomType.name" header="Tipo de Cuarto" style={styles.column} />
          <Column field="quantity" header="Cantidad" style={styles.column} />
          <Column
            header="Acciones"
            body={rowData => (
              <Button
                icon="pi pi-trash"
                onClick={() => handleDelete(rowData)}
                style={styles.deleteButton}
              />
            )}
            style={styles.column}
          />
        </DataTable>
      </div>

      <div style={styles.navigationButtons}>
        <Button
          label="Volver a Hoteles"
          icon="pi pi-arrow-left"
          onClick={() => navigate('/hotels')}
          style={styles.navButton}
        />
        <Button
          label="Menú Principal"
          icon="pi pi-home"
          onClick={() => navigate('/')}
          style={styles.navButton}
        />
      </div>
    </div>
  );
}

// Estilos mejorados
const styles = {
  container: {
    background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)',
    minHeight: '100vh',
    padding: '2rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  noHotelMessage: {
    textAlign: 'center',
    marginTop: '3rem',
    color: '#555',
    fontSize: '1.2rem'
  },
  hotelHeader: {
    textAlign: 'center',
    marginBottom: '2rem',
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  },
  hotelName: {
    fontSize: '1.8rem',
    color: '#00796b',
    marginBottom: '0.5rem'
  },
  hotelRooms: {
    fontSize: '1rem',
    color: '#00897b',
    fontWeight: '500'
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    marginBottom: '2rem'
  },
  formRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  dropdown: {
    flex: '1',
    minWidth: '200px'
  },
  inputNumber: {
    flex: '1',
    minWidth: '200px'
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem'
  },
  saveButton: {
    backgroundColor: '#26a69a',
    border: 'none',
    padding: '0.75rem 1.5rem',
    color: 'white',
    borderRadius: '6px',
    fontWeight: '500'
  },
  clearButton: {
    backgroundColor: '#ef5350',
    border: 'none',
    padding: '0.75rem 1.5rem',
    color: 'white',
    borderRadius: '6px',
    fontWeight: '500'
  },
  tableContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    marginBottom: '2rem'
  },
  dataTable: {
    width: '100%'
  },
  column: {
    padding: '1rem'
  },
  deleteButton: {
    color: '#ef5350',
    border: 'none',
    backgroundColor: 'transparent'
  },
  navigationButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1.5rem'
  },
  navButton: {
    backgroundColor: '#5c6bc0',
    border: 'none',
    padding: '0.75rem 1.5rem',
    color: 'white',
    borderRadius: '6px'
  }
};
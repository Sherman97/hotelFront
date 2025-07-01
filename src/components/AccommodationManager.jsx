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

  // Carga inicial de datos
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

  // Recargar tabla
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

    // Detectar si existe para actualizar o crear
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
        // Limpiar formulario tras acción
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
    return <p className="text-center mt-6">Selecciona un hotel para ver sus acomodaciones.</p>;
  }

  return (
    <div className="mt-10 max-w-3xl mx-auto px-4">
      <Toast ref={toast} />

      {hotelInfo && (
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-bold mb-2">{hotelInfo.name}</h3>
          <p className="text-sm text-gray-600">Habitaciones totales: {hotelInfo.max_rooms}</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Dropdown
          value={selectedRoomType}
          onChange={e => setSelectedRoomType(e.value)}
          options={roomTypes}
          optionLabel="name"
          placeholder="Tipo de Cuarto"
          className="w-full md:w-1/3"
        />
        <Dropdown
          value={selectedAccommodation}
          onChange={e => setSelectedAccommodation(e.value)}
          options={accommodationOptions}
          optionLabel="name"
          placeholder="Acomodación"
          className="w-full md:w-1/3"
        />
        <InputNumber
          value={roomQuantity}
          onValueChange={e => setRoomQuantity(e.value)}
          placeholder="Cantidad"
          className="w-full md:w-1/3"
          min={1}
        />
      </div>

      <div className="flex justify-end gap-3 mb-6">
        <Button label="Guardar" icon="pi pi-save" onClick={handleSave} severity="success" />
        <Button
          label="Limpiar"
          icon="pi pi-times"
          onClick={() => {
            setSelectedRoomType(null);
            setSelectedAccommodation(null);
            setRoomQuantity(null);
          }}
          severity="secondary"
        />
      </div>

      <DataTable
        value={assignedAccommodations}
        showGridlines
        responsiveLayout="scroll"
        emptyMessage="No disponible"
      >
        <Column field="accommodation.name" header="Acomodación" />
        <Column field="roomType.name" header="Tipo de Cuarto" />
        <Column field="quantity" header="Cantidad" />
        <Column
          header="Acciones"
          body={rowData => (
            <Button
              icon="pi pi-trash"
              className="p-button-text p-button-danger"
              onClick={() => handleDelete(rowData)}
            />
          )}
        />
      </DataTable>
      <div className="button-group" style={{ marginTop: '2rem' }}>
        <Button
          label="Volver a Hoteles"
          icon="pi pi-arrow-left"
          className="p-button-text"
          onClick={() => navigate('/hotels')}
        />
        <Button
          label="Menú Principal"
          icon="pi pi-home"
          className="p-button-text"
          onClick={() => navigate('/')}
        />
      </div>
    </div>
  );
}

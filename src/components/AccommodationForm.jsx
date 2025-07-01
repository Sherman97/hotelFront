import { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getAccommodationsByHotel } from '../services/accommodationService'; // Asegúrate de tener este servicio

const AccommodationManager = ({ hotelId }) => {
  const [accommodations, setAccommodations] = useState([]);
  const [filters, setFilters] = useState({ name: '', description: '' });

  const loadAccommodations = () => {
    getAccommodationsByHotel(hotelId).then(res => setAccommodations(res.data));
  };

  useEffect(() => {
    if (hotelId) {
      loadAccommodations();
    }
  }, [hotelId]);

  const filteredData = accommodations.filter(acc =>
    acc.name.toLowerCase().includes(filters.name.toLowerCase()) &&
    acc.description.toLowerCase().includes(filters.description.toLowerCase())
  );

  const actionBodyTemplate = (rowData) => (
    <div className="flex gap-2">
      <Button icon="pi pi-pencil" rounded severity="info" />
      <Button icon="pi pi-trash" rounded severity="danger" />
    </div>
  );

  return (
    <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Acomodaciones</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <InputText
          value={filters.name}
          onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Filtrar por nombre"
        />
        <InputText
          value={filters.description}
          onChange={(e) => setFilters(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Filtrar por descripción"
        />
        <Button icon="pi pi-plus" label="Agregar" className="justify-self-end" />
      </div>

      <DataTable
        value={filteredData}
        paginator
        rows={5}
        responsiveLayout="scroll"
        emptyMessage="No hay acomodaciones disponibles"
        className="p-datatable-sm"
      >
        <Column field="name" header="Nombre" sortable />
        <Column field="description" header="Descripción" sortable />
        <Column header="Acciones" body={actionBodyTemplate} style={{ width: '150px' }} />
      </DataTable>
    </div>
  );
};

export default AccommodationManager;

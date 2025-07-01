import { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { ButtonGroup } from 'primereact/buttongroup';
import { getCities } from '../services/cities';
import AccommodationManager from './AccommodationManager';


import { deleteHotel} from '../services/hotelService';


export default function HotelForm({ onSubmit, initialData = null, onSuccess  }) {
  
  const [form, setForm] = useState({
    name: '',
    address: '',
    nit: '',
    max_rooms: 0,
  });

  const handleReset = () => {
    setForm({
      name: '',
      address: '',
      city: '',
      nit: '',
      max_rooms: 0,
    });
    setSelectedCity(null);
  };

  const handleDelete = () => {
    if (!form.id) return;
    
    if (confirm('¿Estás seguro de que deseas eliminar este hotel?')) {
      deleteHotel(form.id)
        .then(() => {
          onSuccess();
          handleReset(); 
        })
        .catch(err => {
          console.error('Error al eliminar hotel', err);
        });
    } 
  }

  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    getCities().then(res => setCities(res.data));
  }, []);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        city_id: initialData.city_id,
      });
  
      const selected = cities.find(city => city.name === initialData.city);
      if (selected) {
        setSelectedCity(selected);
      }
    }
  }, [initialData, cities]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.value);
    setForm(prev => ({ ...prev, city: e.value.name, city_id: e.value.id }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    handleReset();    
    onSuccess();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full mx-auto bg-white shadow-md rounded-xl p-8 space-y-6
                max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mt-12"
    >
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Gestión de Hoteles
      </h2>
      <div className="mb-4"> 
        <input name="name"  placeholder="Nombre"
          value={form.name} onChange={handleChange}
          className="p-inputtext p-component w-full"
        />
      </div>
      <div className="mb-4"> 
        <input
          name="address" value={form.address}
          placeholder="Dirección"
          onChange={handleChange}
          className="p-inputtext p-component w-full"
        />
      </div>
      <div className="mb-4"> 
        <Dropdown
          value={selectedCity}
          onChange={handleCityChange}
          options={cities}
          optionLabel="name"
          placeholder="Seleccione una ciudad"
          className="w-full"
        />
      </div>
      <div className="mb-4"> 
        <input
          name="nit"  value={form.nit}
          placeholder="NIT"
          onChange={handleChange}
          className="p-inputtext p-component w-full"
        />
      </div>
      <div className="mb-4"> 
        <input
          name="max_rooms"
          type="number" value={form.max_rooms}
          placeholder="Habitaciones máx."
          onChange={handleChange}
          className="p-inputtext p-component w-full"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between mt-6">
        <Button icon="pi pi-check" label="Guardar" severity="success" className="w-full md:w-1/2" rounded />
        <Button icon="pi pi-trash" label="Borrar" severity="danger" className="w-full md:w-1/2" type="button"
         onClick={handleDelete} disabled={!form.id}  rounded />
        <Button label="Cancelar" icon="pi pi-times" severity="secondary" className="w-full md:w-1/2"
         onClick={handleReset} rounded />

      </div>
    </form> 
    


  );
}

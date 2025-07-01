import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import bgImage from '../assets/fondo.jpg';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();

  // Datos de ejemplo (luego reemplazar con datos reales/API)
  const stats = [
    { label: 'Hoteles', value: 12, icon: 'pi pi-building', color: 'stat-indigo' },
    { label: 'Habitaciones', value: 240, icon: 'pi pi-bed', color: 'stat-green' },
    { label: 'Reservas', value: 87, icon: 'pi pi-calendar', color: 'stat-yellow' },
    { label: 'Clientes', value: 350, icon: 'pi pi-users', color: 'stat-pink' },
    { label: 'Ingresos', value: '$15,000', icon: 'pi pi-dollar', color: 'stat-teal' },
    { label: 'Disponibilidad', value: '76%', icon: 'pi pi-chart-line', color: 'stat-red' }
  ];

  return (
    <div
      className="dashboard"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="dashboard-content">
        <div className="header-bar">
          <h1>Bienvenido al Panel de Administración</h1>
          <Button
            label="Ver Hoteles"
            icon="pi pi-list"
            className="p-button-rounded p-button-success"
            onClick={() => navigate('/hotels')}
          />
        </div>

        <Divider align="center">
          <b>Estadísticas</b>
        </Divider>

        <div className="stats-grid">
          {stats.map(stat => (
            <Card key={stat.label} className="stat-card">
              <i className={`${stat.icon} stat-icon ${stat.color}`}></i>
              <h3>{stat.label}</h3>
              <p className={`stat-value ${stat.color}`}>{stat.value}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

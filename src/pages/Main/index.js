import React, { useState, useEffect } from 'react';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { Restore, Favorite } from '@material-ui/icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import Query from '../Query';
import Medic from '../Medic';

import './styles.scss';

export default function Main() {
  const [value, setValue] = React.useState('query');

  const SelectPage = () => {
    let page = <Query />

    switch (value) {
      case 'medic':
        page = <Medic />
        break;

      default:
        break;
    }

    return page
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <h2 className="headerTitle">{format(new Date(), 'dd - MMMM - yyyy', { locale: ptBR })}</h2>
      <BottomNavigation value={value} onChange={handleChange} className="headerNavigation">
        <BottomNavigationAction label="Consultas" value="query" icon={<Restore />} />
        <BottomNavigationAction label="Médicos" value="medic" icon={<Favorite />} />
      </BottomNavigation>

      <div className="container-global">
        <SelectPage />
      </div>
    </>
  );
}
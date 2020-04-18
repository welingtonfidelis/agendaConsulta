import React, { useState, useEffect } from 'react';
import { format, endOfMonth, startOfMonth } from 'date-fns';
import { IconButton } from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';

import ModalQuery from '../../components/ModalQuery';

import api from '../../services/api';
import swal from '../../services/swal';

import './styles.scss'

export default function Query() {
    const [queryList, setQueryList] = useState([]);
    const [dateStart, setDateStart] = useState(startOfMonth(new Date()));
    const [dateEnd, setDateEnd] = useState(endOfMonth(new Date()));
    const [showModal, setShowModal] = useState(false);
    const [queryEditId, setQueryEditId] = useState(0);

    useEffect(() => {

        async function carregaAgenda() {
            try {
                const query = await api.get(
                    `consultations` +
                    `?date_gte=${format(dateStart, 'yyyy-MM-dd')}` +
                    `&date_lte=${format(dateEnd, 'yyyy-MM-dd')}` +
                    `&_expand=medic` +
                    `&_sort=date&_order=asc`
                );

                if (query) {
                    setQueryList(query.data);
                    console.log(query.data);

                }
                else swal.swalErrorInform(null, 'Houve um problema ao trazer a agenda de consultas.');

            } catch (error) {
                console.log(error);
                swal.swalErrorInform(null, 'Houve um problema ao trazer a agenda de consultas.');
            }
        };

        carregaAgenda();

    }, []);

    function handleEditQuery(id) {
        setQueryEditId(id)
        setShowModal(true);
    }

    function saveFunction(item) {
        console.log('retornou', item);
        
    }

    return (
        <>
            {queryList.map(item => {
                const { medic } = item;
                return (
                    <div className="flex-col content" key={item.id}>
                        <div className="flex-row">
                            <div className="flex-col content-date">
                                <span>{format(new Date(item.date), 'dd/MM/yyyy')}</span>
                                <span>{format(new Date(item.date), 'hh:mm')}</span>
                            </div>

                            <div className="flex-col content-info">
                                <span>
                                    Paciente: <span className="content-text">{item.patientName}</span>
                                    &nbsp;
                                    Contato: <span className="content-text">{item.phone}</span>
                                </span>
                                <span>
                                    Médico: <span className="content-text">{medic.name}</span>
                                </span>
                            </div>

                            <div className="flex-col content-actions">
                                <IconButton
                                    onClick={() => handleEditQuery(item.id)}
                                    title="Editar"
                                    className="btn-icon-edit"
                                    aria-label="upload picture"
                                    component="span"
                                >
                                    <Edit />
                                </IconButton>
                                <IconButton
                                    title="Deletar"
                                    className="btn-icon-del"
                                    aria-label="upload picture"
                                    component="span"
                                >
                                    <Delete />
                                </IconButton>
                            </div>
                        </div>

                    </div>
                )
            })}
            <ModalQuery 
                showModal={showModal} 
                setShowModal={setShowModal} 
                id={queryEditId}
                saveFunction={saveFunction} />
        </>
    )
}
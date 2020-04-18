import React, { useState, useEffect } from 'react';
import { format, endOfMonth, startOfMonth } from 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';
import {
    TextField, Button, Select,
    InputLabel, MenuItem, FormControl
} from '@material-ui/core';

import ModalMedic from '../../components/ModalMedic';

import api from '../../services/api';
import swal from '../../services/swal';

import medicLogo from '../../assets/image/medic.png';

import './styles.scss'

export default function Medic() {
    const [medicList, setMedicList] = useState([]);
    const [medicListFull, setMedicListFull] = useState([]);
    const [filter, setFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [medicEditId, setMedicEditId] = useState(0);

    useEffect(() => {
        getListMedics();

    }, []);

    async function getListMedics() {
        try {
            const query = await api.get('medics');

            if (query) {
                setMedicList(query.data);
                setMedicListFull(query.data);
            }

        } catch (error) {
            console.log(error);
            swal.swalErrorInform(null, 'Houve um problema ao trazer a lista de médicos.');
        }
    }

    function handleEditMedic(id) {
        setMedicEditId(id)
        setShowModal(true);
    }

    function handleNewMedic() {
        setMedicEditId(0)
        setShowModal(true);
    }

    async function handleDeleteMedic(id) {
        const resp = await swal.swalConfirm(null, 'Gostaria de excluir este médico?');

        if (resp) {
            try {
                const query = await api.delete(`medics/${id}`);

                if (query) {
                    getListMedics();
                    swal.swalInform(null, 'Médico excluído com sucesso');
                }

            } catch (error) {
                console.log(error);
                swal.swalErrorInform(null, 'Houve um problema ao excluir o médico.');
            }

        }
    }

    useEffect(() => {
        if (filter !== '') {
            const filtred = medicListFull.filter((obj) => {
                obj.search = (obj.name ? obj.name.toLowerCase() : '')
                    + ' ' + (obj.phone ? obj.phone.toLowerCase() : '')
                    + ' ' + (obj.checkIn ? obj.checkIn.toLowerCase() : '')
                    + ' ' + (obj.checkOut ? obj.checkOut.toLowerCase() : '')

                return ((obj.search).indexOf(filter.toLowerCase()) > -1);
            })

            setMedicList(filtred);
        }
        else setMedicList(medicListFull);
    }, [filter]);

    return (
        <>
            <div className="header-action">
                <div className="header-action-search">
                    <TextField
                        required
                        fullWidth
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        id="filterMedic"
                        label="Procurar"
                        variant="outlined"
                    />
                </div>

                <div >
                    <Button className="btn-action" onClick={handleNewMedic}>Novo</Button>
                </div>
            </div>

            {medicList.map(item => {
                return (
                    <div className="flex-row content-medic" key={item.id}>
                        <div className="content-medic-image">
                            <img src={medicLogo} alt="logo médico" />
                        </div>

                        <div className="flex-col content-medic-info">
                            <span className="content-text">{item.name}</span>
                            <span className="content-text">{item.phone}</span>

                            <div className="flex-row">
                                <span>Entrada: <span className="content-text">{item.checkIn}</span></span>
                                &nbsp;
                                <span>Saída: <span className="content-text">{item.checkOut}</span></span>
                            </div>
                        </div>

                        <div className="flex-col content-actions">
                            <IconButton
                                onClick={() => handleEditMedic(item.id)}
                                title="Editar"
                                className="btn-icon-edit"
                                aria-label="upload picture"
                                component="span"
                            >
                                <Edit />
                            </IconButton>
                            
                            <IconButton
                                onClick={() => handleDeleteMedic(item.id)}
                                title="Deletar"
                                className="btn-icon-del"
                                aria-label="upload picture"
                                component="span"
                            >
                                <Delete />
                            </IconButton>
                        </div>
                    </div>
                )
            })}
            <ModalMedic
                showModal={showModal}
                setShowModal={setShowModal}
                id={medicEditId}
                reloadListFunction={getListMedics} />
        </>
    )
}
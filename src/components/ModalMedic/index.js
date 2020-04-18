import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Modal, Backdrop, Fade, TextField,
    Button, Select, InputLabel, MenuItem
} from '@material-ui/core';
import { format, addMinutes, subMinutes, isEqual, compareAsc } from 'date-fns';

import api from '../../services/api';
import swal from '../../services/swal';

import './styles.scss';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

export default function ModalMedic({ showModal, setShowModal, id, reloadListFunction }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [checkiIn, setCheckIn] = useState(format(new Date(), 'HH:mm'));
    const [checkiOut, setCheckOut] = useState(format(new Date(), 'HH:mm'));
    const [nameTmp, setNameTmp] = useState('');
    const classes = useStyles();

    useEffect(() => {
        if (id > 0) {
            console.log('temos id', id);
        }

    }, [id]);

    const handleClose = () => {
        setShowModal(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();


        // if (checkHourMedic() && await checkDateQuery()) {
        //     try {
        //         const data = {
        //             patientName,
        //             phone,
        //             date: format(new Date(`${date} ${hour}`), 'yyyy-MM-dd HH:mm'),
        //             medicId
        //         }

        //         let query = null;
        //         if(id > 0 ) query = await api.put(`consultations/${id}`, data);
        //         else query = await api.post('consultations', data);

        //         if (query) {
        //             console.log('fecho')
        //             swal.swalInform();
        //             clearFields();
        //             reloadListFunction();
        //             handleClose();
        //         }
        //         else {
        //             console.log('nao fecho', query);

        //         }

        //     } catch (error) {
        //         console.log(error);
        //         swal.swalErrorInform();
        //     }
        // }
    }

    const clearFields = () => {
        setName('');
        setPhone('');
        setCheckIn(format(new Date(), 'HH:mm'));
        setCheckOut(format(new Date(), 'HH:mm'));
        setNameTmp(null);
    }

    const checkNameMedic = () => {
        let work = true;



        return work;
    }

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={showModal}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={showModal}>

                    <form id="form-modal" onSubmit={handleSubmit} className={classes.paper}>
                        <h2>{id > 0 ? "Editar médico" : "Cadastrar médico"}</h2>

                        <div className="input-space flex-row input-date">
                            <TextField
                                fullWidth
                                required
                                id="name"
                                label="Nome"
                                variant="outlined"
                                value={name}
                                onChange={event => setName(event.target.value)}
                            />
                        </div>

                        <div className="input-space flex-row input-date">
                            <TextField
                                required
                                fullWidth
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                id="phone"
                                label="Telefone"
                                variant="outlined"
                                type="number"
                            />
                        </div>

                        <div className="flex-row input-space">
                            <TextField
                                fullWidth
                                required
                                type="time"
                                id="checkin"
                                label="Entrada"
                                variant="outlined"
                                value={checkiIn}
                                onChange={event => setCheckIn(event.target.value)}
                            />

                            <TextField
                                fullWidth
                                required
                                type="time"
                                id="checkout"
                                label="Saída"
                                variant="outlined"
                                value={checkiOut}
                                onChange={event => setCheckOut(event.target.value)}
                            />
                        </div>

                        <Button fullWidth className="btn-action" type="submit">Salvar</Button>
                    </form>
                </Fade>
            </Modal>
        </div>
    );
}
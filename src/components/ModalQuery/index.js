import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Modal, Backdrop, Fade, TextField,
    Button, Select, InputLabel, MenuItem
} from '@material-ui/core';
import { format, addMinutes, subMinutes, isEqual, compareAsc } from 'date-fns';

import api from '../../services/api';
import swal from '../../services/swal';

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

export default function ModalQuery({ showModal, setShowModal, id, saveFunction }) {
    const [patientName, setPatientName] = useState('');
    const [phone, setPhone] = useState('');
    const [medicId, setMedicId] = useState(0);
    const [listMedic, setListMedic] = useState([]);
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [hour, setHour] = useState(format(new Date(), 'HH:mm'));
    const classes = useStyles();

    useEffect(() => {
        if (id) console.log('temos id', id);
        else console.log('nao temos id');

        async function getInfo() {
            try {
                const query = await api.get('medics');

                console.log(query.data);
                if (query.data) {
                    setListMedic(query.data);
                    setMedicId(query.data[0].id);
                }

            } catch (error) {
                console.log(error);
                swal.swalErrorInform(null, 'Houve um problem ao trazer a lista de médicos. Por favor, tente novamente');
            }
        };

        getInfo();
    }, [id]);

    const handleClose = () => {
        setShowModal(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (checkHourMedic() && await checkDateQuery()) {
            try {
                const query = await api.post('consultations', {
                    patientName,
                    phone,
                    date: format(new Date(`${date} ${hour}`), 'yyyy-MM-dd HH:mm'),
                    medicId,
                });

                if (query.data) {
                    swal.swalInform();
                    clearFields();
                    saveFunction(query.data);
                    setShowModal(false);
                }

            } catch (error) {
                console.log(error);
                swal.swalErrorInform();
            }
        }
    }

    const clearFields = () => {
        setPatientName('');
        setPhone('');
        setMedicId(0);
        setDate(format(new Date(), 'yyyy-MM-dd'));
        setHour(format(new Date(), 'HH:mm'));
    }

    const checkHourMedic = () => {
        console.log('validando medico');

        let work = true;

        for (const item of listMedic) {
            if (item.id === medicId) {
                if (compareAsc(
                    new Date(`1990-07-28 ${hour}`),
                    new Date(`1990-07-28 ${item.checkIn}`)) > 0) {
                    if (compareAsc(
                        new Date(`1990-07-28 ${item.checkOut}`),
                        new Date(`1990-07-28 ${hour}`)) > 0) {
                    }
                    else {
                        swal.swalErrorInform(null, `O médico atende até as ${item.checkOut}.`);
                        work = false;
                    }
                }
                else {
                    swal.swalErrorInform(null, `O médico atende a partir das ${item.checkIn}.`);
                    work = false;
                }

                break;
            }
        }

        return work;
    }

    const checkDateQuery = async () => {
        console.log('validando consulta');

        let free = true;

        try {
            let dateQuery = new Date(`${date} ${hour}`),
                dateStart = subMinutes(dateQuery, 30),
                dateEnd = addMinutes(dateQuery, 30);

            const query = await api.get(
                `consultations` +
                `?date_gte=${format(dateStart, 'yyyy-MM-dd HH:mm')}` +
                `&date_lte=${format(dateEnd, 'yyyy-MM-dd HH:mm')}` +
                `&medicId=${medicId}`
            );

            if (query.data && query.data.length > 0) {
                for (const el of query.data) {
                    if (isEqual(new Date(el.date), new Date(dateQuery))) {
                        free = false;
                        break;
                    }
                }

                if (free) {
                    const resp = await swal.swalConfirm(
                        'Cuidado',
                        'Existe cosulta com horário próximo ao escolhido (30 minutos ou menos). ' +
                        'Ainda gostaria de salvar esta consulta?');

                    if (!resp) free = false;
                }
                else swal.swalErrorInform(null, 'Já existe uma consulta nesta data e hora escolhida');
            }

        } catch (error) {
            console.log(error);
            free = false;
            swal.swalErrorInform();
        }

        return free;
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
                    <form onSubmit={handleSubmit} className={classes.paper}>
                        <TextField
                            required
                            value={patientName}
                            onChange={e => setPatientName(e.target.value)}
                            id="patientName"
                            label="Paciente"
                            variant="outlined"
                        />

                        <TextField
                            required
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            id="phone"
                            label="Contato"
                            variant="outlined"
                            type="number"
                        />

                        <InputLabel id="medicId">Médico</InputLabel>
                        <Select
                            required
                            labelId="medicId"
                            id="medicId"
                            value={medicId}
                            onChange={e => setMedicId(e.target.value)}
                        >
                            {listMedic.map(el => (
                                <MenuItem key={el.id} value={el.id}>{el.name}</MenuItem>
                            ))}
                        </Select>

                        <TextField
                            // fullWidth
                            required
                            type="date"
                            id="date"
                            label="Data"
                            variant="outlined"
                            value={date}
                            onChange={event => setDate(event.target.value)}
                        />

                        <TextField
                            // fullWidth
                            required
                            type="time"
                            id="hour"
                            label="Horário"
                            variant="outlined"
                            value={hour}
                            onChange={event => setHour(event.target.value)}
                        />
                        <Button type="submit">Salvar</Button>
                    </form>
                </Fade>
            </Modal>
        </div>
    );
}
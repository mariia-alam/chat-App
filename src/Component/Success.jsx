import { useEffect } from 'react';
import Swal from 'sweetalert2';
import success from '../assets/success.png'

export default function Error({message}) {

    useEffect(() => {
        Swal.fire({
        html: `
                <div class="popup">
                    <img src="${success}" alt="Error Icon" class="icon" />
                    <h2 class="title">Well done</h2>
                    <p class="message">${message}</p>
                </div>
        `,
        showCancelButton: false,
        showConfirmButton: true,
        cancelButtonText: 'Ok',
        confirmButtonColor: '#55C366',
        position: 'center',
        heightAuto: false,
        customClass: {
            confirmButton: 'custom-confirm-button-success',
            popup: 'custom-popup-success',
        },
        });
    }, [message]);
    return null;
}

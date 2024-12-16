import { useEffect } from 'react';
import Swal from 'sweetalert2';
// import error from '../assets/error.png';
import error from '../assets/eeeee.png';

export default function Error({message}) {

    useEffect(() => {
        Swal.fire({
        html: `
                <div class="popup">
                    <img src="${error}" alt="Error Icon" class="icon" />
                    <h2 class="title">Error</h2>
                    <p class="message">${message}</p>
                </div>
        `,
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: 'Ok',
        cancelButtonColor: '#F32D4A',
        // width: '400px',
        position: 'center',
        heightAuto: false,
        customClass: {
            cancelButton: 'custom-cancel-button-error',
            popup: 'custom-popup-error',
        },
        });
    }, [message]);
    return null;
}

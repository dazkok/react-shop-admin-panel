import axios from "axios";
import {SyntheticEvent} from "react";

const removeImage = async (e: SyntheticEvent, image: string, setImage: Function) => {
    e.preventDefault()

    await axios.post(`file/destroy`, {'filename': image})
        .then(response => {
            setImage('');
        })
        .catch(error => {
            console.error('Error while sending a file remove request:', error);
        });
}

export default removeImage;
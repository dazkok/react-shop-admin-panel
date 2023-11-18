import React from 'react';
import {Grid, TextField} from "@mui/material";
import diacritics from "diacritics";

const TextToLinkField = (props: {
    text: string,
    setText: Function,
    textPlaceholder: string,
    link: string,
    setLink: Function
}) => {
    const setTitleAndLink = (inputString: string) => {
        props.setText(inputString);
        const stringWithoutDiacritics = diacritics.remove(inputString);

        const sanitizedString = stringWithoutDiacritics
            .replace(/[^\w\s-]/g, '')  // Remove non-alphanumeric characters except spaces and hyphens
            .trim()                 // Trim leading and trailing spaces
            .replace(/\s+/g, '-')    // Replace spaces with hyphens
            .toLowerCase();          // Convert to lowercase

        props.setLink(sanitizedString);
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <TextField label={props.textPlaceholder}
                           value={props.text}
                           margin="normal"
                           required
                           fullWidth
                           onChange={e => setTitleAndLink(e.target.value)}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField label={'Link'}
                           value={props.link}
                           margin="normal"
                           required
                           disabled={true}
                           fullWidth
                />
            </Grid>
        </Grid>
    );
};

export default TextToLinkField;

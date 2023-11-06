import React from 'react';
import Box from "@mui/material/Box";
import {TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {ProductImage} from "../../models/product-image";

const ProductImageFied = (props: { image: ProductImage }) => {

    return (
        <Box key={props.image.id} sx={{display: 'flex', mb: 3, border: '1px solid black'}}>
            <img src={'http://localhost:8010/images/' + props.image.image}
                 alt={'preview'}
                 style={{objectFit: "cover"}}
                 loading={'lazy'}
                 height={'200px'}
                 width={'180px'}/>
            <Box sx={{mx: 3, display: 'flex', flexDirection: 'column'}}>
                <TextField label={'Alt'}
                           size={'small'}
                           value={props.image.alt}
                           margin="normal"
                           inputProps={{
                               maxLength: 70,
                           }}
                    // onChange={e => setMetaTitle(e.target.value)}
                />
                <TextField label={'Order'}
                           size={'small'}
                           disabled
                           value={props.image.order}
                           margin="normal"
                           inputProps={{
                               maxLength: 70
                           }}
                    // onChange={e => setMetaTitle(e.target.value)}
                />
                <Button type={'button'}
                        color={'error'}
                        variant="contained"
                        // onClick={removeImage}
                >Remove</Button>
            </Box>
        </Box>
    )
}

export default ProductImageFied;
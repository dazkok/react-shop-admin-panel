import React from 'react';
import Box from "@mui/material/Box";
import {TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {ProductImage} from "../../models/product-image";

const ProductImageField = (props: { image: ProductImage, removeImage: Function, setImageAlt: Function }) => {

    return (
        <Box key={props.image.id}
             width={'400px'}
             sx={{display: 'flex', boxShadow: 2, background: 'white'}}
        >
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
                               maxLength: 70
                           }}
                    onChange={(e) => props.setImageAlt(e.target.value, props.image.id)}
                />
                <TextField label={'Order'}
                           size={'small'}
                           disabled
                           value={props.image.order}
                           margin="normal"
                           inputProps={{
                               maxLength: 70
                           }}
                />
                <Button sx={{mt: 2}}
                        type={'button'}
                        color={'error'}
                        variant="contained"
                        onClick={(e) => props.removeImage(props.image.image, props.image.id, e)}
                >Remove</Button>
            </Box>
        </Box>
    )
}

export default ProductImageField;
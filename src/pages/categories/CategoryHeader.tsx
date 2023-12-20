import React from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {ButtonGroup, Switch, Tooltip} from "@mui/material";
import Button from "@mui/material/Button";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

const CategoryHeader = ({id, image, title, enable, deleteFunction}: {
    id: number,
    image: string,
    title: string,
    enable: boolean,
    deleteFunction: Function
}) => {

    const boxStyle = {
        backgroundColor: enable ? 'white' : 'lightgray'
    }

    return (
        <Box sx={{
            ...boxStyle,
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            pr: 2
        }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center'
            }}>
                <img src={image} alt={''} loading="lazy" height={'60px'} width={'60px'} style={{objectFit: 'cover'}}/>
                <Typography sx={{ml: 2}}>{title}</Typography>
            </Box>
            <ButtonGroup>
                <Tooltip title={'Edit'}>
                    <Button variant="outlined"
                            size={'small'} color={"primary"}
                            href={`/categories/${id}/edit`}>
                        <EditRoundedIcon/>
                    </Button>
                </Tooltip>

                <Tooltip title={'Delete'}>
                    <Button variant="outlined"
                            size={'small'} color={"error"}
                            onClick={() => deleteFunction(id)}
                    >
                        <DeleteRoundedIcon/>
                    </Button>
                </Tooltip>
            </ButtonGroup>
        </Box>
    )
}

export default CategoryHeader;
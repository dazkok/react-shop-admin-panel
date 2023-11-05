import React, {useCallback, useMemo} from 'react';
import {useDropzone} from 'react-dropzone'
import axios from "axios";

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const focusedStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

const ImageUpload = (props: any) => {
    const maxSize = 1048576;
    const maxFiles = props.maxFiles;

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const uploadPromises = acceptedFiles.map((file) => {
                return axios.post('file/store', {'file': file}, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                    .then(response => response.data); // Отримуємо відповідь і повертаємо її як результат обіцянки
            });

            Promise.all(uploadPromises)
                .then(responses => {
                    props.handleImageUpload(responses);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, []);

    const {
        isDragActive,
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject,
        fileRejections
    } = useDropzone({
        onDrop,
        accept: {
            'image/*': [],
        },
        minSize: 0,
        maxSize,
        maxFiles: maxFiles
    });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isFocused,
        isDragAccept,
        isDragReject
    ]);

    const isFileTooLarge = fileRejections.length > 0 && fileRejections[0].file.size > maxSize;

    return (
        <div className="text-center">
            <div {...getRootProps({style})}>
                <input {...getInputProps()} />
                {!isDragActive && 'Click here or drop a file to upload!'}
                {isDragActive && !isDragReject && "Drop it like it's hot!"}
                {isDragReject && "File type not accepted, sorry!"}
                {isFileTooLarge && (
                    <div className="text-danger mt-2">
                        File is too large.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;
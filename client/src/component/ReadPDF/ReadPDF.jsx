import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

const ReadPDF = ({ fileUrl }) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <div style={{ height: '90vh' }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
                <Viewer
                    fileUrl={fileUrl}
                    plugins={[defaultLayoutPluginInstance]}
                />
            </Worker>
        </div>
    );
};

export default ReadPDF;
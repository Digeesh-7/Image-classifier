import React, { useState } from 'react';
import './App.css';

function App() {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); // Preview the image
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const classifyImage = async () => {
        if (!file) {
            alert("Please select an image first!");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true); // Start loading state

        try {
            const response = await fetch('http://localhost:5001/predict', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            if (data.error) {
                setResult(`Error: ${data.error}`);
            } else {
                setResult(`Prediction: ${data.prediction}, Probability: ${data.probability}%`);
            }
        } catch (error) {
            console.error('Error during API request:', error);
            setResult('Failed to classify the image.');
        } finally {
            setLoading(false); // Stop loading state
        }
    };

    return (
        <div className="App">
            <div className="overlay">
                <div className="title-section">
                    <h1>Image Classification</h1>
                </div>

                <div className="container">
                    <div className="upload-section">
                        <label className="upload-label">
                            Upload Image
                            <input type="file" onChange={handleFileChange} accept="image/*" className="file-input" />
                        </label>
                        {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
                    </div>

                    <button onClick={classifyImage} className="classify-button">
                        {loading ? 'Classifying...' : 'Classify Image'}
                    </button>

                    <div id="result">
                        {loading && <div className="loading-spinner"></div>}
                        {result && <strong>{result}</strong>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;

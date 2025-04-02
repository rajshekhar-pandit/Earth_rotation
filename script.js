const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Environment variables
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint for geocoding
app.get('/api/geocode', async (req, res) => {
    try {
        const { query } = req.query;
        
        // Check if input is coordinates
        const coordMatch = query.match(/^(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)$/);
        if (coordMatch) {
            const lat = parseFloat(coordMatch[1]);
            const lon = parseFloat(coordMatch[2]);
            
            if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
                return res.json({
                    lat,
                    lon,
                    name: `Coordinates: ${lat.toFixed(6)}, ${lon.toFixed(6)}`
                });
            } else {
                return res.status(400).json({ error: "Invalid coordinates" });
            }
        }

        // Geocode location name
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}`
        );

        if (response.data.results && response.data.results.length > 0) {
            const location = response.data.results[0];
            res.json({
                lat: location.geometry.location.lat,
                lon: location.geometry.location.lng,
                name: location.formatted_address
            });
        } else {
            res.status(404).json({ error: "Location not found" });
        }
    } catch (error) {
        console.error("Geocoding error:", error);
        res.status(500).json({ error: "Error searching for location" });
    }
});

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
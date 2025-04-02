// Three.js and Google Maps initialization
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 1.5;
controls.maxDistance = 10;

// Store initial camera position and target
const initialCameraPosition = new THREE.Vector3(0, 0, 3);
const initialControlsTarget = new THREE.Vector3(0, 0, 0);

// Earth rotation control
let earthRotationSpeed = 0.002;
let isRotationLocked = false;
let lockedLocation = null;
let googleMap = null;

// Initialize Google Maps
function initMap() {
    googleMap = new google.maps.Map(document.getElementById('satellite-view'), {
        zoom: 15,
        mapTypeId: 'satellite',
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: 'none'
    });
}

// Search location using backend API
async function searchLocation(query) {
    document.getElementById('loading').style.display = 'block';
    
    try {
        const response = await fetch(`/api/geocode?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (data.error) {
            alert(data.error);
        } else {
            focusOnLocation(data.lat, data.lon, data.name);
        }
    } catch (error) {
        console.error("Search error:", error);
        alert("Error searching for location");
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

// ... Rest of the frontend JavaScript code from previous version ...
// (All the vector conversion, focusOnLocation, updateSatelliteView, etc.)
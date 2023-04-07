import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import './Home.css'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FiSearch } from 'react-icons/fi'

const API_KEY = '4OVsYnRo7iOcJ8D'

const markerIcon = new L.Icon({
  iconUrl: require('../../assets/map.png'),
  iconSize: [35, 35],
  iconAnchor: [17, 45],
  popupAnchor: [0, -40],
})

const Home = () => {
  const [inputId, setInputId] = useState({
    ip: '',
  })
  const [toFind, setToFind] = useState('157.46.165.199')
  const [location, setLocation] = useState({})
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(false)

  const mapRef = useRef()

  const handleIp = (e) => {
    setInputId({
      ...inputId,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setToFind(inputId.ip)
    setInputId({ ip: '' })
  }

  useEffect(() => {
    setLoading(true)
    async function fetchData() {
      try {
        const response = await axios.get(`https://pro.ip-api.com/json/${toFind}?key=${API_KEY}`);
        if (!response.data || !response.data.lat || !response.data.lon) {
          setErrorMsg(true);
        } else {
          setLocation(response.data);
          setLatitude(response.data.lat);
          setLongitude(response.data.lon);
          setLoading(false);
          setErrorMsg(false);
        }
      } catch (error) {
        console.error(error);
        setErrorMsg(true);
      }
    }
    fetchData();
  }, [toFind]);


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="input">
          <input
           type="text" 
            name="ip"
            placeholder="Enter IP. eg 103.48.198.141"
            value={inputId.ip}
            onChange={handleIp}
            autocomplete="off"
            required
          />
          <button>
            <FiSearch style={{ fontSize: '25px' }} />
          </button>
        </div>
      </form>
      <div className="items">
        <MapContainer center={[latitude, longitude]} zoom={2} ref={mapRef}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {!errorMsg && (
            <Marker position={[latitude, longitude]} icon={markerIcon}>
              <Popup>
                {location.city}, {location.regionName}, {location.country}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      <div className="details-container">
        <h1>Location details</h1>
        {loading && (
          <div className="linear-loader">
            <div></div>
          </div>
        )}
        {!errorMsg ? (
          <div className="details">
            <p>IP: {toFind}</p>
            <p>Query: {location.query}</p>
            <p>Status: {location.status}</p>
            <p>Country: {location.country}</p>
            <p>Country Code: {location.countryCode}</p>
            <p>Region: {location.region}</p>
            <p>Region Name: {location.regionName}</p>
            <p>City: {location.city}</p>
            <p>District: {location.district}</p>
            <p>Postal Code: {location.zip}</p>
            <p>Latitude: {location.lat}</p>
            <p>Longitude: {location.lon}</p>
            <p>Time Zone: {location.timezone}</p>
            <p>ISP: {location.isp}</p>
            <p>Org: {location.org}</p>
            <p>As: {location.as}</p>
          </div>
        ):<h4 style={{color:"red",marginTop:"20px"}}>Please check the IP address .</h4>}
      </div>
    </div>
  )
}

export default Home

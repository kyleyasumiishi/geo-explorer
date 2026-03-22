import { useState } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

export default function WorldMap({ selected, highlighted, onSelect }) {
  const [hovered, setHovered] = useState(null)
  const focus = highlighted || selected
  const center = focus ? [focus.latlng[1], focus.latlng[0]] : [0, 0]
  const zoom = focus ? 4 : 1

  return (
    <ComposableMap
      projection="geoEqualEarth"
      projectionConfig={{ scale: 160 }}
      className="w-full h-full"
    >
      <ZoomableGroup center={center} zoom={zoom}>
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name = geo.properties.name
              const isSelected = name && (selected?.mapName === name || highlighted?.mapName === name)

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => onSelect(name)}
                  onMouseEnter={() => setHovered(name)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    default: {
                      fill: isSelected ? '#2563eb' : '#e2e8f0',
                      stroke: isSelected ? '#1d4ed8' : '#ffffff',
                      strokeWidth: 0.5,
                      outline: 'none',
                    },
                    hover: {
                      fill: isSelected ? '#2563eb' : '#cbd5e1',
                      stroke: isSelected ? '#1d4ed8' : '#ffffff',
                      strokeWidth: 0.5,
                      outline: 'none',
                      cursor: 'pointer',
                    },
                    pressed: {
                      fill: '#2563eb',
                      stroke: '#1d4ed8',
                      strokeWidth: 0.5,
                      outline: 'none',
                    },
                  }}
                />
              )
            })
          }
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  )
}

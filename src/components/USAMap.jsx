import { useState } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'

export default function USAMap({ selected, highlighted, onSelect }) {
  const [hovered, setHovered] = useState(null)

  return (
    <ComposableMap
      projection="geoAlbersUsa"
      projectionConfig={{ scale: 1000 }}
      className="w-full h-full"
    >
      <ZoomableGroup>
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name = geo.properties.name
              const isSelected = selected?.name === name || highlighted?.name === name

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

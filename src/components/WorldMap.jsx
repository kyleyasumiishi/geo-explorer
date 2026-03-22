import { useState } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

export default function WorldMap({ selected, onSelect }) {
  const [hovered, setHovered] = useState(null)

  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{ scale: 130, center: [0, 30] }}
      className="w-full h-full"
    >
      <ZoomableGroup>
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const code = geo.id
              const isSelected = code && selected?.cca3 === code
              const isHovered = hovered === code

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => onSelect(code)}
                  onMouseEnter={() => setHovered(code)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    default: {
                      fill: isSelected ? '#f59e0b' : '#374151',
                      stroke: '#1f2937',
                      strokeWidth: 0.5,
                      outline: 'none',
                    },
                    hover: {
                      fill: isSelected ? '#f59e0b' : '#6b7280',
                      stroke: '#1f2937',
                      strokeWidth: 0.5,
                      outline: 'none',
                      cursor: 'pointer',
                    },
                    pressed: {
                      fill: '#f59e0b',
                      stroke: '#1f2937',
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

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
              const isSelected = name && selected?.mapName === name
              const isHighlighted = name && highlighted?.mapName === name

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => onSelect(name)}
                  onMouseEnter={() => setHovered(name)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    default: {
                      fill: isHighlighted ? '#3b82f6' : isSelected ? '#f59e0b' : '#374151',
                      stroke: '#1f2937',
                      strokeWidth: 0.5,
                      outline: 'none',
                    },
                    hover: {
                      fill: isHighlighted ? '#3b82f6' : isSelected ? '#f59e0b' : '#6b7280',
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

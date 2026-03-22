import { useState } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'

const DEFAULT_CENTER = [-96, 38]
const DEFAULT_ZOOM = 1

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
              const isSelected = selected?.name === name
              const isHighlighted = highlighted?.name === name

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

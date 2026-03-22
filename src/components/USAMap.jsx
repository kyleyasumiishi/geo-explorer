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
                      fill: isSelected ? '#e11d48' : '#243040',
                      stroke: isSelected ? '#be123c' : '#2d3f55',
                      strokeWidth: 0.5,
                      outline: 'none',
                    },
                    hover: {
                      fill: isSelected ? '#e11d48' : '#2d3f55',
                      stroke: isSelected ? '#be123c' : '#2d3f55',
                      strokeWidth: 0.5,
                      outline: 'none',
                      cursor: 'pointer',
                    },
                    pressed: {
                      fill: '#e11d48',
                      stroke: '#be123c',
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

import countries from './countries.json'

// TopoJSON name -> countries.json name mapping
const MAP_NAME_FIXES = {
  'W. Sahara': 'Western Sahara',
  'Dem. Rep. Congo': 'DR Congo',
  'Dominican Rep.': 'Dominican Republic',
  'Falkland Is.': 'Falkland Islands',
  'Fr. S. Antarctic Lands': 'French Southern and Antarctic Lands',
  'Central African Rep.': 'Central African Republic',
  'Eq. Guinea': 'Equatorial Guinea',
  'eSwatini': 'Eswatini',
  'Solomon Is.': 'Solomon Islands',
  'Bosnia and Herz.': 'Bosnia and Herzegovina',
  'Macedonia': 'North Macedonia',
  'S. Sudan': 'South Sudan',
  'United States of America': 'United States',
  'Côte d\'Ivoire': 'Ivory Coast',
  'Congo': 'Republic of the Congo',
}

// Countries that appear on the 110m TopoJSON map
const COUNTRIES_ON_MAP = new Set([
  ...Object.values(MAP_NAME_FIXES),
  // All other countries whose common name matches the TopoJSON name directly
  ...countries.map(c => c.name.common),
])

// These small territories/islands don't appear on the 110m map
const MISSING_FROM_MAP = new Set([
  'American Samoa', 'Andorra', 'Anguilla', 'Antigua and Barbuda', 'Aruba',
  'Bahrain', 'Barbados', 'Bermuda', 'Bouvet Island', 'British Indian Ocean Territory',
  'British Virgin Islands', 'Cape Verde', 'Caribbean Netherlands', 'Cayman Islands',
  'Christmas Island', 'Cocos (Keeling) Islands', 'Comoros', 'Cook Islands', 'Curaçao',
  'Dominica', 'Faroe Islands', 'French Guiana', 'French Polynesia', 'Gibraltar',
  'Grenada', 'Guadeloupe', 'Guam', 'Guernsey', 'Heard Island and McDonald Islands',
  'Hong Kong', 'Isle of Man', 'Jersey', 'Kiribati', 'Liechtenstein', 'Macau',
  'Maldives', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritius', 'Mayotte',
  'Micronesia', 'Monaco', 'Montserrat', 'Nauru', 'Niue', 'Norfolk Island',
  'Northern Mariana Islands', 'Palau', 'Pitcairn Islands', 'Réunion',
  'Saint Barthélemy', 'Saint Helena, Ascension and Tristan da Cunha',
  'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Martin', 'Saint Pierre and Miquelon',
  'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Seychelles',
  'Singapore', 'Sint Maarten', 'South Georgia', 'Svalbard and Jan Mayen',
  'São Tomé and Príncipe', 'Tokelau', 'Tonga', 'Turks and Caicos Islands',
  'Tuvalu', 'United States Minor Outlying Islands', 'United States Virgin Islands',
  'Vatican City', 'Wallis and Futuna', 'Åland Islands',
  // Disputed territories in TopoJSON but not in our data
  'N. Cyprus', 'Somaliland',
])

// Filtered list: only countries visible on the map
export const mappableCountries = countries.filter(c => !MISSING_FROM_MAP.has(c.name.common))

export { MAP_NAME_FIXES }

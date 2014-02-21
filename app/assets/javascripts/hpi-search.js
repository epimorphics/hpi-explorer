var HpiSearch = function() {
  var regionNames =  [
      {
        "value": "Warrington", "label": "Warrington"
      } ,
      {
        "value": "South Tyneside", "label": "South Tyneside"
      } ,
      {
        "value": "Ealing", "label": "Ealing"
      } ,
      {
        "value": "North East", "label": "North East"
      } ,
      {
        "value": "Croydon", "label": "Croydon"
      } ,
      {
        "value": "Wrexham", "label": "Wrexham"
      } ,
      {
        "value": "Barnsley", "label": "Barnsley"
      } ,
      {
        "value": "Milton Keynes", "label": "Milton Keynes"
      } ,
      {
        "value": "Newcastle upon Tyne", "label": "Newcastle upon Tyne"
      } ,
      {
        "value": "City of Bristol", "label": "City of Bristol"
      } ,
      {
        "value": "Merton", "label": "Merton"
      } ,
      {
        "value": "Thurrock", "label": "Thurrock"
      } ,
      {
        "value": "Essex", "label": "Essex"
      } ,
      {
        "value": "Rochdale", "label": "Rochdale"
      } ,
      {
        "value": "Knowsley", "label": "Knowsley"
      } ,
      {
        "value": "Greenwich", "label": "Greenwich"
      } ,
      {
        "value": "City of Peterborough", "label": "City of Peterborough"
      } ,
      {
        "value": "Bolton", "label": "Bolton"
      } ,
      {
        "value": "City of Nottingham", "label": "City of Nottingham"
      } ,
      {
        "value": "Sandwell", "label": "Sandwell"
      } ,
      {
        "value": "Stockton-on-Tees", "label": "Stockton-on-Tees"
      } ,
      {
        "value": "North West", "label": "North West"
      } ,
      {
        "value": "Greater London", "label": "Greater London"
      } ,
      {
        "value": "Wakefield", "label": "Wakefield"
      } ,
      {
        "value": "Derbyshire", "label": "Derbyshire"
      } ,
      {
        "value": "Blackburn with Darwen", "label": "Blackburn with Darwen"
      } ,
      {
        "value": "Powys", "label": "Powys"
      } ,
      {
        "value": "Hounslow", "label": "Hounslow"
      } ,
      {
        "value": "West Sussex", "label": "West Sussex"
      } ,
      {
        "value": "Northumberland", "label": "Northumberland"
      } ,
      {
        "value": "Cumbria", "label": "Cumbria"
      } ,
      {
        "value": "Worcestershire", "label": "Worcestershire"
      } ,
      {
        "value": "Darlington", "label": "Darlington"
      } ,
      {
        "value": "Devon", "label": "Devon"
      } ,
      {
        "value": "City of Plymouth", "label": "City of Plymouth"
      } ,
      {
        "value": "Gwynedd", "label": "Gwynedd"
      } ,
      {
        "value": "Salford", "label": "Salford"
      } ,
      {
        "value": "Hartlepool", "label": "Hartlepool"
      } ,
      {
        "value": "Isle of Wight", "label": "Isle of Wight"
      } ,
      {
        "value": "Richmond upon Thames", "label": "Richmond upon Thames"
      } ,
      {
        "value": "Durham", "label": "Durham"
      } ,
      {
        "value": "Cambridgeshire", "label": "Cambridgeshire"
      } ,
      {
        "value": "Bromley", "label": "Bromley"
      } ,
      {
        "value": "Coventry", "label": "Coventry"
      } ,
      {
        "value": "South East", "label": "South East"
      } ,
      {
        "value": "North Yorkshire", "label": "North Yorkshire"
      } ,
      {
        "value": "North Lincolnshire", "label": "North Lincolnshire"
      } ,
      {
        "value": "Herefordshire", "label": "Herefordshire"
      } ,
      {
        "value": "Caerphilly", "label": "Caerphilly"
      } ,
      {
        "value": "Lancashire", "label": "Lancashire"
      } ,
      {
        "value": "Barnet", "label": "Barnet"
      } ,
      {
        "value": "Gloucestershire", "label": "Gloucestershire"
      } ,
      {
        "value": "Calderdale", "label": "Calderdale"
      } ,
      {
        "value": "Flintshire", "label": "Flintshire"
      } ,
      {
        "value": "Hammersmith and Fulham", "label": "Hammersmith and Fulham"
      } ,
      {
        "value": "East Riding of Yorkshire", "label": "East Riding of Yorkshire"
      } ,
      {
        "value": "Rhondda Cynon Taff", "label": "Rhondda Cynon Taff"
      } ,
      {
        "value": "Walsall", "label": "Walsall"
      } ,
      {
        "value": "Rotherham", "label": "Rotherham"
      } ,
      {
        "value": "Bournemouth", "label": "Bournemouth"
      } ,
      {
        "value": "Rutland", "label": "Rutland"
      } ,
      {
        "value": "England and Wales", "label": "England and Wales"
      } ,
      {
        "value": "Merthyr Tydfil", "label": "Merthyr Tydfil"
      } ,
      {
        "value": "Kirklees", "label": "Kirklees"
      } ,
      {
        "value": "Lambeth", "label": "Lambeth"
      } ,
      {
        "value": "Tameside", "label": "Tameside"
      } ,
      {
        "value": "Luton", "label": "Luton"
      } ,
      {
        "value": "St Helens", "label": "St Helens"
      } ,
      {
        "value": "Surrey", "label": "Surrey"
      } ,
      {
        "value": "Torfaen", "label": "Torfaen"
      } ,
      {
        "value": "Wirral", "label": "Wirral"
      } ,
      {
        "value": "City of Kingston upon Hull", "label": "City of Kingston upon Hull"
      } ,
      {
        "value": "Brent", "label": "Brent"
      } ,
      {
        "value": "Halton", "label": "Halton"
      } ,
      {
        "value": "Leeds", "label": "Leeds"
      } ,
      {
        "value": "Wales", "label": "Wales"
      } ,
      {
        "value": "Merseyside", "label": "Merseyside"
      } ,
      {
        "value": "Havering", "label": "Havering"
      } ,
      {
        "value": "Trafford", "label": "Trafford"
      } ,
      {
        "value": "Sheffield", "label": "Sheffield"
      } ,
      {
        "value": "Birmingham", "label": "Birmingham"
      } ,
      {
        "value": "Shropshire", "label": "Shropshire"
      } ,
      {
        "value": "Ceredigion", "label": "Ceredigion"
      } ,
      {
        "value": "Sunderland", "label": "Sunderland"
      } ,
      {
        "value": "Oldham", "label": "Oldham"
      } ,
      {
        "value": "Yorks and Humber", "label": "Yorks and Humber"
      } ,
      {
        "value": "City of Derby", "label": "City of Derby"
      } ,
      {
        "value": "Tyne and Wear", "label": "Tyne and Wear"
      } ,
      {
        "value": "Redcar and Cleveland", "label": "Redcar and Cleveland"
      } ,
      {
        "value": "Wiltshire", "label": "Wiltshire"
      } ,
      {
        "value": "Isle of Anglesey", "label": "Isle of Anglesey"
      } ,
      {
        "value": "North East Lincolnshire", "label": "North East Lincolnshire"
      } ,
      {
        "value": "Torbay", "label": "Torbay"
      } ,
      {
        "value": "Kent", "label": "Kent"
      } ,
      {
        "value": "Enfield", "label": "Enfield"
      } ,
      {
        "value": "Swindon", "label": "Swindon"
      } ,
      {
        "value": "Wigan", "label": "Wigan"
      } ,
      {
        "value": "Leicester", "label": "Leicester"
      } ,
      {
        "value": "Greater Manchester", "label": "Greater Manchester"
      } ,
      {
        "value": "Lincolnshire", "label": "Lincolnshire"
      } ,
      {
        "value": "South Gloucestershire", "label": "South Gloucestershire"
      } ,
      {
        "value": "Leicestershire", "label": "Leicestershire"
      } ,
      {
        "value": "Southend-on-Sea", "label": "Southend-on-Sea"
      } ,
      {
        "value": "Lewisham", "label": "Lewisham"
      } ,
      {
        "value": "Bury", "label": "Bury"
      } ,
      {
        "value": "Waltham Forest", "label": "Waltham Forest"
      } ,
      {
        "value": "Reading", "label": "Reading"
      } ,
      {
        "value": "Cardiff", "label": "Cardiff"
      } ,
      {
        "value": "Northamptonshire", "label": "Northamptonshire"
      } ,
      {
        "value": "Tower Hamlets", "label": "Tower Hamlets"
      } ,
      {
        "value": "Sefton", "label": "Sefton"
      } ,
      {
        "value": "Suffolk", "label": "Suffolk"
      } ,
      {
        "value": "Cornwall", "label": "Cornwall"
      } ,
      {
        "value": "Conwy", "label": "Conwy"
      } ,
      {
        "value": "Wolverhampton", "label": "Wolverhampton"
      } ,
      {
        "value": "Kensington and Chelsea", "label": "Kensington and Chelsea"
      } ,
      {
        "value": "Liverpool", "label": "Liverpool"
      } ,
      {
        "value": "Hackney", "label": "Hackney"
      } ,
      {
        "value": "City of Westminster", "label": "City of Westminster"
      } ,
      {
        "value": "Bridgend", "label": "Bridgend"
      } ,
      {
        "value": "The Vale of Glamorgan", "label": "The Vale of Glamorgan"
      } ,
      {
        "value": "Camden", "label": "Camden"
      } ,
      {
        "value": "East Sussex", "label": "East Sussex"
      } ,
      {
        "value": "South West", "label": "South West"
      } ,
      {
        "value": "West Yorkshire", "label": "West Yorkshire"
      } ,
      {
        "value": "Southampton", "label": "Southampton"
      } ,
      {
        "value": "Dudley", "label": "Dudley"
      } ,
      {
        "value": "Kingston upon Thames", "label": "Kingston upon Thames"
      } ,
      {
        "value": "Newham", "label": "Newham"
      } ,
      {
        "value": "Poole", "label": "Poole"
      } ,
      {
        "value": "North Tyneside", "label": "North Tyneside"
      } ,
      {
        "value": "Newport", "label": "Newport"
      } ,
      {
        "value": "Middlesbrough", "label": "Middlesbrough"
      } ,
      {
        "value": "Bracknell Forest", "label": "Bracknell Forest"
      } ,
      {
        "value": "Islington", "label": "Islington"
      } ,
      {
        "value": "Southwark", "label": "Southwark"
      } ,
      {
        "value": "Neath Port Talbot", "label": "Neath Port Talbot"
      } ,
      {
        "value": "East", "label": "East"
      } ,
      {
        "value": "Bradford", "label": "Bradford"
      } ,
      {
        "value": "Monmouthshire", "label": "Monmouthshire"
      } ,
      {
        "value": "Wokingham", "label": "Wokingham"
      } ,
      {
        "value": "Cheshire West and Chester", "label": "Cheshire West and Chester"
      } ,
      {
        "value": "North Somerset", "label": "North Somerset"
      } ,
      {
        "value": "Brighton and Hove", "label": "Brighton and Hove"
      } ,
      {
        "value": "Denbighshire", "label": "Denbighshire"
      } ,
      {
        "value": "Swansea", "label": "Swansea"
      } ,
      {
        "value": "Wrekin", "label": "Wrekin"
      } ,
      {
        "value": "Central Bedfordshire", "label": "Central Bedfordshire"
      } ,
      {
        "value": "West Midlands (region)", "label": "West Midlands (region)"
      } ,
      {
        "value": "York", "label": "York"
      } ,
      {
        "value": "Dorset", "label": "Dorset"
      } ,
      {
        "value": "Windsor and Maidenhead", "label": "Windsor and Maidenhead"
      } ,
      {
        "value": "Oxfordshire", "label": "Oxfordshire"
      } ,
      {
        "value": "Stoke-on-Trent", "label": "Stoke-on-Trent"
      } ,
      {
        "value": "Staffordshire", "label": "Staffordshire"
      } ,
      {
        "value": "Pembrokeshire", "label": "Pembrokeshire"
      } ,
      {
        "value": "Norfolk", "label": "Norfolk"
      } ,
      {
        "value": "Buckinghamshire", "label": "Buckinghamshire"
      } ,
      {
        "value": "South Yorkshire", "label": "South Yorkshire"
      } ,
      {
        "value": "Cheshire East", "label": "Cheshire East"
      } ,
      {
        "value": "West Berkshire", "label": "West Berkshire"
      } ,
      {
        "value": "East Midlands", "label": "East Midlands"
      } ,
      {
        "value": "London", "label": "London"
      } ,
      {
        "value": "Solihull", "label": "Solihull"
      } ,
      {
        "value": "Nottinghamshire", "label": "Nottinghamshire"
      } ,
      {
        "value": "Bath and North East Somerset", "label": "Bath and North East Somerset"
      } ,
      {
        "value": "Medway", "label": "Medway"
      } ,
      {
        "value": "Wandsworth", "label": "Wandsworth"
      } ,
      {
        "value": "Haringey", "label": "Haringey"
      } ,
      {
        "value": "West Midlands", "label": "West Midlands"
      } ,
      {
        "value": "Blackpool", "label": "Blackpool"
      } ,
      {
        "value": "Carmarthenshire", "label": "Carmarthenshire"
      } ,
      {
        "value": "Portsmouth", "label": "Portsmouth"
      } ,
      {
        "value": "Hillingdon", "label": "Hillingdon"
      } ,
      {
        "value": "Stockport", "label": "Stockport"
      } ,
      {
        "value": "Harrow", "label": "Harrow"
      } ,
      {
        "value": "Bedford", "label": "Bedford"
      } ,
      {
        "value": "Hertfordshire", "label": "Hertfordshire"
      } ,
      {
        "value": "Barking and Dagenham", "label": "Barking and Dagenham"
      } ,
      {
        "value": "Doncaster", "label": "Doncaster"
      } ,
      {
        "value": "Sutton", "label": "Sutton"
      } ,
      {
        "value": "Manchester", "label": "Manchester"
      } ,
      {
        "value": "Warwickshire", "label": "Warwickshire"
      } ,
      {
        "value": "Hampshire", "label": "Hampshire"
      } ,
      {
        "value": "Slough", "label": "Slough"
      } ,
      {
        "value": "Bexley", "label": "Bexley"
      } ,
      {
        "value": "Blaenau Gwent", "label": "Blaenau Gwent"
      } ,
      {
        "value": "Somerset", "label": "Somerset"
      } ,
      {
        "value": "Redbridge", "label": "Redbridge"
      } ,
      {
        "value": "Gateshead", "label": "Gateshead"
      }
    ];

    // module return value
    return {
      regionNames: regionNames
    }

}();


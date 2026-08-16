const { MongoClient } = require('mongodb');
require('dotenv').config();

// name = shown to the user, location = shown under the name,
// article = the Wikipedia page we pull a photo from
const places = [
  { name: 'Big Ben', location: 'London, UK', article: 'Big Ben' },
  { name: 'Eiffel Tower', location: 'Paris, France', article: 'Eiffel Tower' },
  { name: 'Venice', location: 'Italy', article: 'Venice' },
  { name: 'Colosseum', location: 'Rome, Italy', article: 'Colosseum' },
  { name: 'Statue of Liberty', location: 'New York, USA', article: 'Statue of Liberty' },
  { name: 'Sydney Opera House', location: 'Sydney, Australia', article: 'Sydney Opera House' },
  { name: 'Great Wall of China', location: 'China', article: 'Great Wall of China' },
  { name: 'Taj Mahal', location: 'Agra, India', article: 'Taj Mahal' },
  { name: 'Machu Picchu', location: 'Peru', article: 'Machu Picchu' },
  { name: 'Christ the Redeemer', location: 'Rio de Janeiro, Brazil', article: 'Christ the Redeemer (statue)' },
  { name: 'Petra', location: 'Jordan', article: 'Petra' },
  { name: 'Golden Gate Bridge', location: 'San Francisco, USA', article: 'Golden Gate Bridge' },
  { name: 'Mount Fuji', location: 'Japan', article: 'Mount Fuji' },
  { name: 'Pyramids of Giza', location: 'Egypt', article: 'Giza pyramid complex' },
  { name: 'Niagara Falls', location: 'Canada / USA', article: 'Niagara Falls' },
  { name: 'Santorini', location: 'Greece', article: 'Santorini' },
  { name: 'Great Barrier Reef', location: 'Australia', article: 'Great Barrier Reef' },
  { name: 'Angkor Wat', location: 'Cambodia', article: 'Angkor Wat' },
  { name: 'Burj Khalifa', location: 'Dubai, UAE', article: 'Burj Khalifa' },
  { name: 'Times Square', location: 'New York, USA', article: 'Times Square' },
  { name: 'Grand Canyon', location: 'Arizona, USA', article: 'Grand Canyon' },
  { name: 'Neuschwanstein Castle', location: 'Bavaria, Germany', article: 'Neuschwanstein Castle' },
  { name: 'Chichen Itza', location: 'Yucatan, Mexico', article: 'Chichen Itza' },
  { name: 'Victoria Falls', location: 'Zambia / Zimbabwe', article: 'Victoria Falls' },
  { name: 'Table Mountain', location: 'Cape Town, South Africa', article: 'Table Mountain' },
  { name: 'Iguazu Falls', location: 'Argentina / Brazil', article: 'Iguazu Falls' },
  { name: 'Banff National Park', location: 'Alberta, Canada', article: 'Banff National Park' },
  { name: 'Dubrovnik', location: 'Croatia', article: 'Dubrovnik' },
  { name: 'Uluru', location: 'Northern Territory, Australia', article: 'Uluru' },
  { name: 'Stonehenge', location: 'Wiltshire, England', article: 'Stonehenge' },
  { name: 'Mount Kilimanjaro', location: 'Tanzania', article: 'Mount Kilimanjaro' },
  { name: 'Bali', location: 'Indonesia', article: 'Bali' },
  { name: 'Reykjavik', location: 'Iceland', article: 'Reykjavík' },
  { name: 'Marrakesh', location: 'Morocco', article: 'Marrakesh' },
  { name: 'Mont Saint-Michel', location: 'Normandy, France', article: 'Mont Saint-Michel' },
  { name: 'Prague', location: 'Czech Republic', article: 'Prague' },
  { name: 'Amalfi Coast', location: 'Italy', article: 'Amalfi Coast' },
  { name: 'Yellowstone National Park', location: 'Wyoming, USA', article: 'Yellowstone National Park' },
  { name: 'Ha Long Bay', location: 'Vietnam', article: 'Ha Long Bay' },
  { name: 'Cappadocia', location: 'Turkey', article: 'Cappadocia' },
  { name: 'Acropolis of Athens', location: 'Athens, Greece', article: 'Acropolis of Athens' },
  { name: 'Sagrada Familia', location: 'Barcelona, Spain', article: 'Sagrada Família' },
  { name: 'Alhambra', location: 'Granada, Spain', article: 'Alhambra' },
  { name: 'Edinburgh Castle', location: 'Edinburgh, Scotland', article: 'Edinburgh Castle' },
  { name: 'Matterhorn', location: 'Switzerland', article: 'Matterhorn' },
  { name: 'Plitvice Lakes', location: 'Croatia', article: 'Plitvice Lakes National Park' },
  { name: "Saint Basil's Cathedral", location: 'Moscow, Russia', article: "Saint Basil's Cathedral" },
  { name: 'Leaning Tower of Pisa', location: 'Pisa, Italy', article: 'Leaning Tower of Pisa' },
  { name: 'Hagia Sophia', location: 'Istanbul, Turkey', article: 'Hagia Sophia' },
  { name: 'Blue Mosque', location: 'Istanbul, Turkey', article: 'Sultan Ahmed Mosque' },
  { name: 'Dead Sea', location: 'Jordan', article: 'Dead Sea' },
  { name: 'Jerusalem Old City', location: 'Jerusalem', article: 'Old City (Jerusalem)' },
  { name: 'Serengeti National Park', location: 'Tanzania', article: 'Serengeti' },
  { name: 'Okavango Delta', location: 'Botswana', article: 'Okavango Delta' },
  { name: 'Zanzibar', location: 'Tanzania', article: 'Zanzibar' },
  { name: 'Sahara Desert', location: 'North Africa', article: 'Sahara' },
  { name: 'Kyoto', location: 'Japan', article: 'Kyoto' },
  { name: 'Gyeongbokgung Palace', location: 'Seoul, South Korea', article: 'Gyeongbokgung' },
  { name: 'Petronas Towers', location: 'Kuala Lumpur, Malaysia', article: 'Petronas Towers' },
  { name: 'Golden Temple', location: 'Amritsar, India', article: 'Harmandir Sahib' },
  { name: 'Maldives', location: 'Indian Ocean', article: 'Maldives' },
  { name: 'Marina Bay Sands', location: 'Singapore', article: 'Marina Bay Sands' },
  { name: 'Antelope Canyon', location: 'Arizona, USA', article: 'Antelope Canyon' },
  { name: 'Yosemite National Park', location: 'California, USA', article: 'Yosemite National Park' },
  { name: 'Mount Rushmore', location: 'South Dakota, USA', article: 'Mount Rushmore' },
  { name: 'Havana', location: 'Cuba', article: 'Havana' },
  { name: 'Salar de Uyuni', location: 'Bolivia', article: 'Salar de Uyuni' },
  { name: 'Easter Island', location: 'Chile', article: 'Easter Island' },
  { name: 'Great Ocean Road', location: 'Victoria, Australia', article: 'Great Ocean Road' },
  { name: 'Milford Sound', location: 'New Zealand', article: 'Milford Sound' },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// asking wikipedia's own pageimages api for a specific thumbnail size,
// it caps to the real image size automatically instead of breaking the url.
// wikipedia asks scripts to send a real User-Agent and not hammer the api,
// without that we were getting blocked/empty results on most requests
async function getImage(article, attemptsLeft = 3) {
  try {
    const url =
      'https://en.wikipedia.org/w/api.php?action=query&format=json&redirects=1&prop=pageimages&pithumbsize=800&titles=' +
      encodeURIComponent(article);
    const res = await fetch(url, {
      headers: { 'User-Agent': 'TravelWiseSeedScript/1.0 (school project)' },
    });
    if (res.status === 429 && attemptsLeft > 0) {
      console.log('  got rate limited, waiting 60s and trying again');
      await sleep(60000);
      return getImage(article, attemptsLeft - 1);
    }
    if (!res.ok) {
      console.log('  http status:', res.status, res.statusText);
      return '';
    }
    const data = await res.json();
    const pages = data.query.pages;
    const page = Object.values(pages)[0];
    return page.thumbnail ? page.thumbnail.source : '';
  } catch (err) {
    console.log('  error:', err.message);
    return '';
  }
}

async function run() {
  const client = await MongoClient.connect(process.env.MONGO_URI);
  const db = client.db();

  // optional: node seed.js "Petra" to only redo one place instead of all 20
  const only = process.argv[2];
  const targets = only
    ? places.filter((p) => p.name.toLowerCase() === only.toLowerCase())
    : places;

  for (const place of targets) {
    const image = await getImage(place.article);
    await db.collection('destinations').updateOne(
      { name: place.name },
      { $set: { name: place.name, location: place.location, image } },
      { upsert: true }
    );
    console.log(place.name, image ? 'ok' : 'no image found');
    await sleep(1500);
  }

  console.log('destinations seeded: ' + targets.length);
  await client.close();
}

run();

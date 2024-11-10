import React from 'react';
import './Recommendation.css';

function Recommendation({ temperature, weatherDescription, humidity, cloudiness, visibility, windSpeed, location }) {
  // Normalize temperature to Celsius for consistency
  const tempInCelsius = temperature;
  
  // Get the current hour
  const currentHour = new Date().getHours();
  const isDaytime = currentHour >= 6 && currentHour < 18; // Define daytime as between 6 AM and 6 PM

  const getRecommendation = () => {
    if (tempInCelsius >= 30) {
      return {
        activity: isDaytime 
          ? "It's extremely hot outside. A cool spot by the pool or staying indoors is recommended. Remember to stay hydrated!"
          : "It's a hot evening. A relaxing dinner in an air-conditioned place or a late-night swim would be great.",
        clothing: "Wear very light, breathable clothes and bring water if you go out.",
        link: `https://www.google.com/maps/search/${isDaytime ? 'swimming+pool' : 'restaurant'}+near+${location}`
      };
    } else if (tempInCelsius >= 20 && tempInCelsius < 30 && weatherDescription.includes("clear")) {
      return {
        activity: isDaytime 
          ? "Great weather for outdoor activities like a picnic, hike, or a walk in the park!"
          : "Nice weather for a cozy evening walk or an outdoor patio dinner.",
        clothing: "Wear comfortable clothes, sunscreen, and sunglasses.",
        link: `https://www.google.com/maps/search/${isDaytime ? 'parks' : 'outdoor+restaurant'}+near+${location}`
      };
    } else if (tempInCelsius >= 10 && tempInCelsius < 20 && weatherDescription.includes("mist")) {
      return {
        activity: isDaytime 
          ? "It's misty and cool. Consider a cozy indoor activity or a nature walk if visibility allows."
          : "Cool and misty evening, perfect for a night at a café or a movie indoors.",
        clothing: "Wear a light jacket and comfortable shoes. Be cautious of reduced visibility.",
        link: `https://www.google.com/maps/search/${isDaytime ? 'cafe+or+museum' : 'cafe+or+movie+theater'}+near+${location}`
      };
    } else if (tempInCelsius >= 10 && tempInCelsius < 20 && cloudiness > 70) {
      return {
        activity: isDaytime 
          ? "Cloudy and mild. Perfect for exploring the city or relaxing in a café."
          : "Cloudy evening—enjoy a quiet night in a café or an indoor event.",
        clothing: "A light jacket is recommended in case it feels cooler.",
        link: `https://www.google.com/maps/search/${isDaytime ? 'cafe' : 'indoor+events'}+near+${location}`
      };
    } else if (tempInCelsius < 10 && tempInCelsius >= 0 && weatherDescription.includes("rain")) {
      return {
        activity: "Cold and rainy—perfect for cozy indoor activities like visiting a museum or café.",
        clothing: "Wear warm, waterproof clothing and bring an umbrella.",
        link: `https://www.google.com/maps/search/indoor+activities+near+${location}`
      };
    } else if (tempInCelsius < 0 && weatherDescription.includes("snow")) {
      return {
        activity: isDaytime 
          ? "Snowy day! Perfect for winter sports or enjoying the snow at a café."
          : "Snowy evening—grab some hot chocolate at a cozy spot.",
        clothing: "Dress warmly with layers, including a heavy coat, gloves, and scarf.",
        link: `https://www.google.com/maps/search/${isDaytime ? 'ski+resort+or+cafe' : 'hot+chocolate+cafe'}+near+${location}`
      };
    } else if (weatherDescription.includes("thunderstorm")) {
      return {
        activity: "Thunderstorms in the area. Best to stay indoors for safety.",
        clothing: "No special clothing required if staying indoors, but be cautious if you need to go outside.",
        link: `https://www.google.com/maps/search/indoor+activities+near+${location}`
      };
    } else if (weatherDescription.includes("drizzle") || weatherDescription.includes("rain") || humidity > 80) {
      return {
        activity: "Wet and humid outside. Consider indoor activities, or bring an umbrella if heading out.",
        clothing: "Wear waterproof clothing or bring an umbrella.",
        link: `https://www.google.com/maps/search/indoor+activities+near+${location}`
      };
    } else if (tempInCelsius > 15 && cloudiness < 20 && visibility > 5) {
      return {
        activity: isDaytime 
          ? "Lovely, clear weather for outdoor activities. Perfect for sightseeing or a park walk."
          : "A beautiful night for stargazing or a quiet evening walk.",
        clothing: "Light clothing and comfortable shoes. Bring a hat or sunglasses if it's sunny.",
        link: `https://www.google.com/maps/search/${isDaytime ? 'sightseeing+or+park' : 'stargazing+or+evening+walk'}+near+${location}`
      };
    } else if (tempInCelsius >= 10 && tempInCelsius < 15 && windSpeed > 10) {
      return {
        activity: isDaytime 
          ? "A bit windy outside. It might be a good day for indoor activities or a short walk."
          : "Windy evening—ideal for a cozy night in or a quick café visit.",
        clothing: "Wear a windbreaker or a jacket to stay comfortable.",
        link: `https://www.google.com/maps/search/${isDaytime ? 'indoor+activities' : 'cafe'}+near+${location}`
      };
    } else {
      return {
        activity: isDaytime 
          ? "The weather is quite neutral. Enjoy a comfortable day out!"
          : "A calm and pleasant night. A relaxing evening out sounds perfect.",
        clothing: "Wear comfortable clothes and dress according to your preference.",
        link: null
      };
    }
  };

  const recommendation = getRecommendation();

  return (
    <div className="recommendation">
      <h2>Recommendation</h2>
      <p><strong>Activity:</strong> {recommendation.activity}</p>
      <p><strong>Clothing:</strong> {recommendation.clothing}</p>
      {recommendation.link && (
        <a href={recommendation.link} target="_blank" rel="noopener noreferrer" className="map-link">
          Explore on Google Maps
        </a>
      )}
    </div>
  );
}

export default Recommendation;

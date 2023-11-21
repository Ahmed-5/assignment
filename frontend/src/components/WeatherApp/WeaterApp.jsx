import React from "react";
import "./WeatherApp.css";
import ChatBox, { ChatFrame } from "react-chat-plugin";
import { FaRobot } from "react-icons/fa6";

import cloudIcon from "../assests/cloud.png";
import clearIcon from "../assests/clear.png";
import drizzleIcon from "../assests/drizzle.png";
import humidityIcon from "../assests/humidity.png";
import rainIcon from "../assests/rain.png";
import searchIcon from "../assests/search.png";
import snowIcon from "../assests/snow.png";
import windIcon from "../assests/wind.png";

const user1 = {
  username: "user1",
  id: 1,
  avatarUrl: "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/45.png",
};

const user2 = {
  username: "user2",
  id: 2,
  avatarUrl: "https://bots.ondiscord.xyz/favicon/android-chrome-256x256.png",
};

export default function WeatherApp() {
  const [query, setQuery] = React.useState("");
  const [activity, setActivity] = React.useState("");
  const [typing, setTyping] = React.useState(false);
  const [weather, setWeather] = React.useState({
    location: "-",
    status: "-",
    description: "-",
    temperature: "-",
    wind: "-",
    humidity: "-",
    clouds: "-",
  });
  const [attr, setAttr] = React.useState({
    showChatbox: false,
    showIcon: true,
    messages: [
      {
        author: user1,
        text: "Hi",
        type: "text",
        timestamp: 1578366393250,
      },
    ],
  });
  const handleClickIcon = () => {
    // toggle showChatbox and showIcon
    setAttr({
      ...attr,
      showChatbox: !attr.showChatbox,
      showIcon: !attr.showIcon,
    });
  };

  const handleOnSendMessage = async (message) => {
    try {
      setAttr({
        ...attr,
        messages: attr.messages.concat({
          author: user1,
          text: message,
          type: "text",
          timestamp: +new Date(),
        }),
      });
      setTyping(true);
    const response = await fetch(
      `http://localhost:8000/respond`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text:message }),
      }
    )
    const data = await response.json();
    const m = data.text
    console.log(data);
    setAttr({
      ...attr,
      messages: attr.messages.concat({
        author: user2,
        text: m,
        type: "text",
        timestamp: +new Date(),
      }),
    });
    setTyping(false);
    } catch (error) {
      setTyping(false);
    }
  };

  const fetchWeather = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/get-weather/${query}`
      );
      const data = await response.json();
      console.log(data);
      setWeather(data);
      setQuery("");
    } catch (error) {
      return;
    }
  };

  const fetchActivity = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/suggest-activity/${weather.location}`
      );
      const data = await response.json();
      console.log(data);
      setActivity(data.activity);
    } catch (error) {
      return;
    }
  };

  const renderWeather = () => {
    switch (weather.status) {
      case "Clouds":
        return cloudIcon;
      case "Clear":
        return clearIcon;
      case "Drizzle":
        return drizzleIcon;
      case "Rain":
        return rainIcon;
      case "Snow":
        return snowIcon;
      case "Humidity":
        return humidityIcon;
      case "Wind":
        return windIcon;
      default:
        return cloudIcon;
    }
  };

  const onEnterKey = (evt) => {
    if (evt.key === "Enter") {
      fetchWeather();
    }
  };

  return (
    <div className="container">
      <div className="top-bar">
        <input
          type="text"
          className="cityInput"
          placeholder="Enter City Name"
          value={query}
          onChange={(evt) => setQuery(evt.target.value)}
          onKeyDown={onEnterKey}
        />
        <div className="search-icon">
          <img src={searchIcon} alt="searchIcon" onClick={fetchWeather} />
        </div>
      </div>
      <div className="weather-image">
        <div className="weather-icon">
          <img src={renderWeather()} alt={weather.status} />
        </div>
        <div className="weather-temp">
          {weather.temperature !== "-" ? Math.round(weather.temperature) : "-"}
          °C
        </div>
        <div className="weather-desc">{weather.description}</div>
        <div className="weather-location">{weather.location}</div>
        <div className="data-container">
          <div className="element">
            <img src={humidityIcon} alt="humidityIcon" className="icon" />
            <div className="element-details">
              <div className="data-key">Humidity</div>
              <div className="data-value">{weather.humidity}%</div>
            </div>
          </div>
          <div className="element">
            <img src={windIcon} alt="windIcon" className="icon" />
            <div className="element-details">
              <div className="data-key">Wind</div>
              <div className="data-value">
                {weather.wind !== "-" ? Math.round(weather.wind) : "-"} m/s
              </div>
            </div>
          </div>
          <div className="element">
            <img src={cloudIcon} alt="cloudIcon" className="icon" />
            <div className="element-details">
              <div className="data-key">Cloud</div>
              <div className="data-value">{weather.clouds}%</div>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom-bar">
        {/* add button to suggest activities */}
        <div className="activity">
          <button className="activity-button" onClick={fetchActivity}>
            Suggest an activity
          </button>
          <div>{activity}</div>
        </div>
      </div>
      <ChatFrame
        chatbox={
          <ChatBox
            onSendMessage={handleOnSendMessage}
            userId={1}
            messages={attr.messages}
            width={"300px"}
            showTypingIndicator={typing}
            activeAuthor={user2}
          />
        }
        // icon={<RobotIcon className="Icon" />}SmartToyOutlinedIcon
        // icon={<SmartToyOutlinedIcon className="Icon" />}
        icon={<FaRobot className="chat-icon"  />}
        // icon={windIcon}
        clickIcon={handleClickIcon}
        showChatbox={attr.showChatbox}
        showIcon={attr.showIcon}
        iconStyle={{ background: "red", fill: "white" }}
      >
        <div className="Greeting" style={{ width: "300px" }}>
          👋 Hey, I’m a ChatBot! Want to see what I can do?
        </div>
      </ChatFrame>
    </div>
  );
}

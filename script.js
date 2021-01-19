/**
name: Weather Service
date: 20.01.2021
version: 1.1
author: Dolynai Anna

Description:
That is a single-page application.
This application finds information about weather forecast from service https://openweathermap.org/ by API calls and displays that in a usuful way for users.
**/

"use strict";

//class for searching weather forecast
class WeatherService
   {
       constructor()
       {
           this.data='';
       }

       async search()
       {
           try
           {
               let response = await fetch(this.url);
               let data=await response.json();
               this.data=data;
               return data;

           }
           catch(error)
           {
               alert(error);
           }
       }
   }

//class for searching weather by location
//inheritance of class WeatherService
//show data of minute forecast for 1 hour, hourly forecast for 48 hours, daily forecast for 7 days, historical data for 5 previous days
class WeatherServiceByLocation extends WeatherService
   {
       constructor(lat,lon)
       {
           super();
           this.url=`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=9adf68c522fb40f207372bd38af2dbf3`;
       }
   }

//class for searching weather by name of city
//inheritance of class WeatherService
class WeatherServiceByCityName extends WeatherService
   {
       constructor(city,country)
       {
           super();
           this.url=`https://api.openweathermap.org/data/2.5/weather?q=${city}${!country?'':','+country}&units=metric&appid=9adf68c522fb40f207372bd38af2dbf3`;
       }
   }
//class for searching weather of closest cities of main location
//inheritance of class WeatherService
class WeatherServiceByClosestCities extends WeatherService
   {
       constructor(lat,lon)
       {
           super();
           this.url=`https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=5&units=metric&appid=9adf68c522fb40f207372bd38af2dbf3`;
       }
   }

//class for searching 5 day weather forecast (shows data every 3 hours) 
//inheritance of class WeatherService
class FiveDayHourlyForecast extends WeatherService
   {
       constructor(lat,lon)
       {
           super();
           this.url=`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=9adf68c522fb40f207372bd38af2dbf3`;
       }
   }

//class for building of current weather block
class CurrentWeatherBlock
   {
       constructor(weatherData)
       {
           this.weatherData=weatherData;
           this.date=new Date();

       }
       timeSetting(time)
       {
           return new Date((time+this.weatherData.timezone_offset)*1000);
           
       }
       build(weatherDivId)
       {
           let div=document.createElement('div');
           div.id="current-weather";
           div.innerHTML=`
                    <div class="container">
                       <h3>CURRENT WEATHER</h3>
                       <p id="date">
                       ${this.date.getDate().toString().padStart(2, '0') }.${(this.date.getMonth()+1).toString().padStart(2,'0')}.${this.date.getFullYear()}
                       </p>
                    </div>
                    <div class="container">
                       <div id="weather-type">
                           <img src="http://openweathermap.org/img/wn/${this.weatherData.current.weather[0].icon}@2x.png" alt="f"><p>${this.weatherData.current.weather[0].main}</p>
                       </div>
                       <div id="temperature">
                           <span>${Math.round(this.weatherData.current.temp)}&#176;C</span>
                           <p>Real Feel ${Math.round(this.weatherData.current.feels_like)}&#176;</p>
                       </div>
                       <div class="container" id="day-duration">
                         <div>
                             <p>Sunrise:</p>
                             <p>Sunset:</p>
                             <p>Duration:</p>
                         </div>
                        <div>
                            <p>
                                ${this.timeSetting(this.weatherData.current.sunrise).getUTCHours()}:${ this.timeSetting(this.weatherData.current.sunrise).getUTCMinutes().toString().padStart(2, '0')} AM
                            </p>
                            <p>
                                ${this.timeSetting(this.weatherData.current.sunset).getUTCHours()}:${ this.timeSetting(this.weatherData.current.sunset).getMinutes().toString().padStart(2, '0')} AM
                            </p>
                            <p>
                                ${Math.floor((this.weatherData.current.sunset-this.weatherData.current.sunrise)/3600)}:${Math.floor((this.weatherData.current.sunset-this.weatherData.current.sunrise)%3600/60).toString().padStart(2, '0')} hr
                            </p>

                        </div>
                       </div>
                    </div>`;
           document.getElementById(weatherDivId).innerHTML='';
           document.getElementById(weatherDivId).append(div);
       }

    }
//class for building of hourly weather block
class HourlyWeatherBlock
   {
       constructor(weatherData)
       {
           this.weatherData=weatherData;
       }

       windDirection(windDeg)
       {

           let result;
           (((windDeg>=348.75)&&(windDeg<=360))||((windDeg>=0)&&(windDeg<11.25)))&&(result='N');
           ((windDeg>=11.25)&&(windDeg<33.75))&&(result='NNE');
           ((windDeg>=33.75)&&(windDeg<56.25))&&(result='NE');
           ((windDeg>=56.25)&&(windDeg<78.75))&&(result='ENE');
           ((windDeg>=78.75)&&(windDeg<101.25))&&(result='E');
           ((windDeg>=101.25)&&(windDeg<123.75))&&(result='ESE');
           ((windDeg>=123.75)&&(windDeg<146.25))&&(result='SE');
           ((windDeg>=146.25)&&(windDeg<168.75))&&(result='SSE');
           ((windDeg>=168.75)&&(windDeg<191.25))&&(result='S');
           ((windDeg>=191.25)&&(windDeg<213.75))&&(result='SSW');
           ((windDeg>=213.75)&&(windDeg<236.25))&&(result='SW');
           ((windDeg>=236.25)&&(windDeg<258.75))&&(result='WSW');
           ((windDeg>=258.75)&&(windDeg<281.25))&&(result='W');
           ((windDeg>=281.25)&&(windDeg<303.75))&&(result='WNW');
           ((windDeg>=303.75)&&(windDeg<326.25))&&(result='NW');
           ((windDeg>=326.25)&&(windDeg<348.75))&&(result='NNW');

           return result;
       }
       dayOfWeek(numOfDay)
       {
           let day;
           (numOfDay==0)&&(day='Sunday');
           (numOfDay==1)&&(day='Monday');
           (numOfDay==2)&&(day='Thueday');
           (numOfDay==3)&&(day='Wednesday');
           (numOfDay==4)&&(day='Thursday');
           (numOfDay==5)&&(day='Friday');
           (numOfDay==6)&&(day='Saturday');

           return day;

       }

       build(weaterDivId)
       {
           let div=document.createElement('div');
           div.id="hourly-weather";
           div.innerHTML=`
              <div class="container">
                  <h3>HOURLY</h3>
              </div>`;
           let table=document.createElement('table');
           let tbody=document.createElement('tbody');
           let tr1=document.createElement('tr');
           tr1.innerHTML=`<td>${((new Date((this.weatherData[0].hour)*1000).getUTCDate()!=new Date(new Date().getTime()+this.weatherData[0].timezone*1000).getUTCDate())? this.dayOfWeek(new Date(this.weatherData[0].hour*1000).getDay()).toUpperCase() :"TODAY" )} </td>`;
           let tr2=document.createElement('tr');
           tr2.innerHTML=`<td> </td>`
           let tr3=document.createElement('tr');
           tr3.innerHTML=`<td>Forcast</td>`
           let tr4=document.createElement('tr');
           tr4.innerHTML=`<td>Temp(&#176;C)</td>`
           let tr5=document.createElement('tr');
           tr5.innerHTML=`<td>RealFeel</td>`
           let tr6=document.createElement('tr');
           tr6.innerHTML=`<td>Wind(km/h)</td>`

           for (let item of this.weatherData)
               {
                   let td=document.createElement('td'); 
                   tr1.innerHTML+=`<td>${(new Date(item.hour*1000).getUTCHours()>12)?new Date(item.hour*1000).getUTCHours()-12+'pm':new Date(item.hour*1000).getUTCHours()+'am'}</td>`;
                   tr2.innerHTML+=`<td><img src="http://openweathermap.org/img/wn/${item.iconId}@2x.png" alt=${item.iconId}></td>`;
                   tr3.innerHTML+=`<td>${item.forecast}</td>`;
                   tr4.innerHTML+=`<td>${Math.round(item.temp)}&#176;</td>`;
                   tr5.innerHTML+=`<td>${Math.round(item.feelsTemp)}&#176;</td>`;
                   tr6.innerHTML+=`<td>${Math.round(item.windSpeed)} ${this.windDirection(item.windDeg)}</td>`;

               }
           tbody.append(tr1);
           tbody.append(tr2);
           tbody.append(tr3);
           tbody.append(tr4);
           tbody.append(tr5);
           tbody.append(tr6);
           table.append(tbody);
           div.append(table);
           document.getElementById(weaterDivId).append(div);
           this.weatherData=[];
       }
   }

//class for building block with data of nearby places
class NearbyPlacesWeatherBlock
   {
       constructor(weatherData)
       {
           this.weatherData=weatherData;
       }
       build(weaterDivId)
       {
           let div=document.createElement('div');
           div.id="nearby";
           div.innerHTML=`
              <div class="container">
                  <h3>NEARBY PLACES</h3>
              </div>`;
           let div1=document.createElement('div');
           div1.id="nearby-city";
           div1.classList.add("container");
           this.weatherData.forEach((item,id)=>
               {
                  (id!=0)&&( div1.innerHTML+=`
                                    <div class="container">
                                        <p>${item.name}</p>
                                        <div class="container">
                                            <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt=${item.weather[0].icon}>
                                            <span>${Math.round(item.main.temp)}&#176;C</span>
                                        </div>
                                    </div>`);
               });
           div.append(div1);

           document.getElementById(weaterDivId).append(div);
           this.weatherData='';
       }
   }

//class for showing information about error
class ErrorBlock
   {
       constructor( data)
       {
           this.data=data;
       }

        build(weaterDivId)
       {

           document.getElementById(weaterDivId).innerHTML=`
                <div id="error">
                    <img src="./error.png" alt='error'>
                    <p>${this.data} could not be found.<br>Please enter a different location.</p>
                </div>`;
       }
   }

//class for building daily forecast block
class ForecastBlock
   {
       constructor(weatherData)
       {
           this.weatherData=weatherData;
       }
       build(weaterDivId)
       {
           document.getElementById(weaterDivId).innerHTML='';
           let div=document.createElement('div');
           div.id="forecast-block";
           div.classList.add('container');
           this.weatherData.forEach((item,id)=>{
               if(id<5)
               {
                   div.innerHTML+=`<div id="${item.dt}" class="container">
                                        <h3>${new Date(item.dt*1000).toDateString().slice(0,3).toUpperCase()}</h3>
                                        <p>${new Date(item.dt*1000).toDateString().slice(3,10).toUpperCase()}</p>
                                        <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt=${item.weather[0].icon}>
                                        <span>${Math.round(item.temp.day)}&#176;C</span>
                                        <p>${item.weather[0].main}</p>
                                    </div>`;
                }
           });
           document.getElementById(weaterDivId).append(div);
       }
   }

//class for searching weather forecast data and display this information to users
class SearchWeather
   {
       constructor()
       {
           this.weatherData = new WeatherServiceByLocation;
           this.currentWeatherBlock='';
           this.hourlyWeatherBlock='';
           this.nearbyCitiesBlock='';
           this.hourlyToday=[];
           this.time='';
           this.launch=true;
           this.btn1=false;
           this.btn2=true;
           this.coords='';
           this.mainCity={};
           this.input=document.querySelector('[name=search]');
           
           this.start();
       }
       
       setAnHourForecastData(data,timezone)
       {
           let obj={};
           obj.hour=data.dt+timezone;
           obj.iconId=data.weather[0].icon;
           obj.forecast=data.weather[0].main;
           obj.temp=data.temp;
           obj.feelsTemp=data.feels_like;
           obj.windSpeed=data.wind_speed;
           obj.windDeg=data.wind_deg;
           obj.timezone=timezone;
           this.hourlyToday.push(obj);
           return this.hourlyToday;
           
       }
       setThreeHourForecastData(data,timezone)
       {
           let obj={};
           obj.hour=data.dt+timezone;
           obj.iconId=data.weather[0].icon;
           obj.forecast=data.weather[0].main;
           obj.temp=data.main.temp;
           obj.feelsTemp=data.main.feels_like;
           obj.windSpeed=data.wind.speed;
           obj.windDeg=data.wind.deg;
           obj.timezone=timezone;
           this.hourlyToday.push(obj);
           return this.hourlyToday;
       }

       buildCurrentDay(pLat,pLon)
       {
           let currentWeather =new WeatherServiceByLocation(pLat,pLon);
           let currentNearbyWeather =new WeatherServiceByClosestCities(pLat,pLon);
           
           currentWeather.search()
               .then(data=>{
                   let count=0;
                   this.hourlyToday=[];
                   this.currentWeatherBlock=new CurrentWeatherBlock(data);
                   this.currentWeatherBlock.build('weather-data');
                   for (let item of data.hourly)
                       {
                           if ((new Date((item.dt+data.timezone_offset)*1000).getUTCDate()==new Date(new Date().getTime()+data.timezone_offset*1000).getUTCDate())&&count<6)
                               {
                                   this.setAnHourForecastData(item,data.timezone_offset);
                                   count++;
                               }

                       }
                   this.hourlyWeatherBlock=new HourlyWeatherBlock(this.hourlyToday);
                   this.hourlyWeatherBlock.build('weather-data');

                   currentNearbyWeather.search()
                       .then((data)=>{
                           this.mainCity={name:data.list[0].name, country:data.list[0].sys.country};
                           this.nearbyCitiesBlock=new NearbyPlacesWeatherBlock(data.list);
                           this.nearbyCitiesBlock.build('weather-data');
                           this.input.placeholder=`${this.mainCity.name}, ${this.mainCity.country}`;
                           this.input.value='';
                   });

                   this.hourlyToday=[];
               
           });

       }
       
       buildForecast(pLat,pLon)
       {
           let currentWeather =new WeatherServiceByLocation(pLat,pLon);
           currentWeather.search()
               .then(data1=>{
                   let forecast=new ForecastBlock(data1.daily);
                   let forecastWeather =new FiveDayHourlyForecast(pLat,pLon);

                   forecast.build('weather-data');
               
                   forecastWeather.search()
                   .then((data)=>{
                       for (let item of data.list)
                           {
                               if (new Date((item.dt+data.city.timezone)*1000).getUTCDate()==new Date(new Date().getTime()+(data.city.timezone*1000)).getUTCDate())
                                   {
                                       this.setThreeHourForecastData(item,data.city.timezone);
                                   }
                           }
                       if(this.hourlyToday.length==0)
                           {
                               let count=0;

                               for (let item of data1.hourly)
                                   {
                                       if ((new Date((item.dt+data1.timezone_offset)*1000).getUTCDate()==new Date(new Date().getTime()+data1.timezone_offset*1000).getUTCDate())&&count<6)
                                           {
                                               this.setAnHourForecastData(item,data1.timezone_offset);
                                               count++;
                                           }
                                    }
                           } 
                       
                       this.hourlyWeatherBlock=new HourlyWeatherBlock(this.hourlyToday);
                       this.hourlyWeatherBlock.build('weather-data');
                       this.hourlyToday=[];
                       
                       document.getElementById('forecast-block').addEventListener('click',(e)=>{
                           for (let item of data.list)
                               {
                                   if ((new Date((item.dt+data.city.timezone)*1000).getUTCDate()==new Date((+e.target.closest('.container').id+data.city.timezone)*1000).getUTCDate()))
                                   {
                                       this.setThreeHourForecastData(item,data.city.timezone);
                                   } 
                               }
                           if(this.hourlyToday.length==0)
                               {
                                   let count=0;
                                   for (let item of data1.hourly)
                                       {
                                           if ((new Date((item.dt+data1.timezone_offset)*1000).getUTCDate()==new Date(new Date().getTime()+data1.timezone_offset*1000).getUTCDate())&&count<6)
                                               {
                                                   this.setAnHourForecastData(item,data1.timezone_offset);
                                                   count++;
                                               }
                                       }
                                }

                           document.getElementById('weather-data').querySelector('#hourly-weather').remove();
                           this.hourlyWeatherBlock=new HourlyWeatherBlock(this.hourlyToday);
                           this.hourlyWeatherBlock.build('weather-data');
                           this.hourlyToday=[];
                       });
                   
                   });
           });
       }
       start()
       {
           if(this.launch)
               {
                   navigator.geolocation.getCurrentPosition((p)=>{
                       this.buildCurrentDay(p.coords.latitude,p.coords.longitude);
                       this.coords={lat:p.coords.latitude,lon:p.coords.longitude}},()=>{
                       this.buildCurrentDay(48.617091,22.303325); this.coords={lat:48.617091,lon:22.303325}});
                   this.launch=false;
               }
           document.getElementById('today').addEventListener('click',(e)=>{
               e.preventDefault();
               this.btn2=true;
               
               if(this.btn1)
                   {
                       document.getElementById('today').classList.toggle("activ-forecast");
                       document.getElementById('forecast').classList.toggle("activ-forecast");
                       document.getElementById('weather-data').innerHTML='';
                       this.buildCurrentDay(this.coords.lat,this.coords.lon);
                       this.btn1=false;
                   }
           });
           
           document.getElementById('forecast').addEventListener('click',(e)=>{
               e.preventDefault();
               this.btn1=true;
               if(this.btn2)
                   {
                       document.getElementById('today').classList.toggle("activ-forecast");
                       document.getElementById('forecast').classList.toggle("activ-forecast");
                       document.getElementById('weather-data').innerHTML='';
                       this.buildForecast(this.coords.lat,this.coords.lon);
                       this.btn2=false;
                   }
           });
           document.getElementById('search-form').addEventListener('submit',(e)=>{
               e.preventDefault();
               this.input=document.querySelector('[name=search]');
               let weatherByCity=new WeatherServiceByCityName(this.input.value);
               weatherByCity.search()
                   .then((data)=>{
                        if (!document.getElementById('today').classList.contains("activ-forecast"))
                            {
                                this.btn1=false;
                                this.btn2=true;
                                document.getElementById('forecast').classList.remove("activ-forecast");
                                document.getElementById('today').classList.add("activ-forecast");
                            }
                        if(data.cod=="404")
                           {
                               let errorBlock=new ErrorBlock(this.input.value);
                               errorBlock.build('weather-data');
                               this.input.placeholder=`${this.input.value}`;
                               setTimeout(()=>{this.input.value=''},1000);
                               this.btn2=false;
                           }
                        else
                           {
                               this.coords={lat:data.coord.lat,lon:data.coord.lon};
                               this.buildCurrentDay(this.coords.lat,this.coords.lon);
                               this.input.placeholder=`${this.mainCity.name}, ${this.mainCity.country}`;
                               this.input.value='';
                               this.btn2=true;
                           }
               });
           
           });
       }
   }

let startService= new SearchWeather();

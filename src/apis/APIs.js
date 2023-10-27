import axios from 'axios';

const hefeng_KEY = 'ba5f09faac324eb49670671fda078d9f';

var hefeng_location='';
var locat=[];

export function getLocation() {
  return locat;
}

function extractText(str) {
  const maxLength = 200; // 最大长度
  str = str.replace(/><.*$/, '');
  const substr = str.substring(maxLength); // 截取从第100个字符开始的子字符串
  const index = substr.indexOf('。'); // 在子字符串中查找第一个句号的位置
  if (index === -1) { // 如果没有找到句号，则返回整个字符串
    return str;
  } else {
    return str.substring(0, maxLength + index + 1); // 返回从第一个字符到句号之间的部分
  }
}

// 发起API请求的函数
export async function fetchCityBriefInfo(cityName) {  
  try {
    const response = await axios({
      url: '/api/item/'+cityName
    });
    console.log(response.data);
    return extractText(response.data.data.description);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch city data.');
  }
}

export async function fetchCityLocation(cityName) {  
  const params = {
    location: cityName,
    key: hefeng_KEY
  };
  // console.info(params);
  try {
    const response = await axios.get('https://geoapi.qweather.com/v2/city/lookup', { params });
    
    // 直接处理返回的数据
    const data = response.data;
    // console.log(data);

    // 如果你需要获取地点的经纬度，你可以这样做：
    var location_temp = {
      lat: data.location[0].lat,
      lon: data.location[0].lon
    }
    locat = [location_temp.lon, location_temp.lat];
    hefeng_location = parseFloat(location_temp.lon).toFixed(2).toString()+','+
      parseFloat(location_temp.lat).toFixed(2).toString()

    return hefeng_location;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch location data.');
  }
}

export async function fetchCityWeather() {  
  const params = {
    lonlat: hefeng_location,
  };
  console.info(params);
  try {
    const response = await axios.get('https://eolink.o.apispace.com/456456/weather/v001/now', { 
      params,
      headers: {
        'X-APISpace-Token': '2kmwacz27vqovumung8rjb5cin4yuspm'
      }
    });
    
    // 直接处理返回的数据
    const data = response.data;
    console.log(data);

    const weatherData = {
      temp: data.result.realtime.temp,
      windDir: data.result.realtime.wind_dir,
      windSpeed: data.result.realtime.wind_class,
      text: data.result.realtime.text,
      pressure: data.result.realtime.pressure,
      humidity: data.result.realtime.rh,
    };

    return weatherData;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch weather data.');
  }
}

export async function fetchCityAir() {  
  const params = {
    location: hefeng_location,
    key: hefeng_KEY
  };
  // console.info(params);
  try {
    const response = await axios.get('https://devapi.qweather.com/v7/air/now', { params });
    
    // 直接处理返回的数据
    const data = response.data;
    // console.log(data);

    const airData = {
      category: data.now.category,
      aqi: data.now.aqi,
      pm2p5: data.now.pm2p5,
      pm10: data.now.pm10
    };

    return airData;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch air data.');
  }
}

export async function fetchCityNews(cityName) {  
  // 检查字符串是否以 '省' 或 '市' 结尾
  if (cityName.endsWith('省')) {
    // 如果是以 '省' 结尾，则去掉 '省'
    cityName = cityName.slice(0, -1);
  } 
  if (cityName.endsWith('市')) {
    // 如果是以 '市' 结尾，则去掉 '市'
    cityName = cityName.slice(0, -1);
  }

  const params = {
    areaname: cityName,
    key: '24a32c93669e8cc6252257ef841bc4ed'
  };
  // console.info(params);
  try {
    const response = await axios('https://apis.tianapi.com/areanews/index', { params });
    
    // 直接处理返回的数据
    const data = response.data;
    // console.log(data);
    if(200!=data.code){
      const newsList = [1, 2, 3].map((item) => {
        return {
          title: '这里好像没有新闻哦……',
          url: ''
        };
      });
      return newsList;
    }
    const newsList = data.result.list.slice(0, 3).map(news => {
      return {
        title: news.title,
        url: news.url
      };
    });
    return newsList;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch news data.');
  }
}

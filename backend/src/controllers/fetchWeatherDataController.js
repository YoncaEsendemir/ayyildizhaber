const weatherService = require("../services/fetchWeatherDataService");

// Tüm şehirler hava durumunu döndürür

const getAllWeather= async(req,res)=>{
    try{
        const weatherData = await weatherService.getAllWeather();
        res.json(weatherData);
    }
    catch(error){
        console.error("Hava durumu verileri alınırken hata oluştu:", error);
        res.status(500).json({ error: "Veri alınamadı" });
    }
};

//Belirtilen şehrin hava durumunu döndürür.
const  getWeatherByCity= async(req,res)=>{
    const cityName= req.params.city;

    try{
     const weatherData = await weatherService.getWeatherByCity(cityName);
     res.json(weatherData);
    }
    catch(error){
       console.log("Hava durumu verileri alınırken hata oluştu:", error)
        res.status(404).json({error:error.message });
    }
}

module.exports={
    getAllWeather,
    getWeatherByCity,
};
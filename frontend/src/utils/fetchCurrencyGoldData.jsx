import axios from "axios"

export const fetchCurrencyGoldData = async () => {
  try {
    const GoldResponse = await axios.get("https://finance.truncgil.com/api/gold-rates")
    console.log("altın Data:", GoldResponse.data);

    
    if (GoldResponse.data) {
      return {
        // Gramaltın Alış, Satış ve Değişim Oranı
        GRA_Buying: GoldResponse.data.Rates.GRA?.Buying || "-",
        GRA_Selling: GoldResponse.data.Rates.GRA?.Selling || "-",
        GRA_Change: GoldResponse.data.Rates.GRA?.Change || "0",
      
        // CEYREKALTIN Alış, Satış ve Değişim Oranı
        CEY_Buying: GoldResponse.data.Rates.CEY?.Buying || "-",
        CEY_Selling: GoldResponse.data.Rates.CEY?.Selling || "-",
        CEY_Change: GoldResponse.data.Rates.CEY?.Change || "0",
      
        // Tamaltın Alış, Satış ve Değişim Oranı
        TAM_Buying: GoldResponse.data.Rates.TAM?.Buying || "-",
        TAM_Selling: GoldResponse.data.Rates.TAM?.Selling || "-",
        TAM_Change: GoldResponse.data.Rates.TAM?.Change || "0",
      }
      
      
    } else {
      console.warn("Altın Döviz verileri boş döndü.")
      return {}
    }
  } catch (error) {
    console.error("Altın Döviz verilerini çekerken hata oluştu:", error)
    return {}
  }
}


import axios from "axios"

export const fetchCurrencyCryptoData = async () => {
  try {
    const CrptoResponse = await axios.get("https://finance.truncgil.com/api/crypto-currency-rates")
    //console.log("BTC Data:", CrptoResponse.data);

    if (CrptoResponse.data) {
      return {
        // Bitcoin Alış, Satış ve Değişim Oranı
        BTC_Buying: CrptoResponse?.data?.Rates?.BTC?.Buying || "-",
        BTC_Selling: CrptoResponse?.data?.Rates?.BTC?.Selling || "-",
        BTC_Change: CrptoResponse?.data?.Rates?.BTC?.Change || "0",
        
      }
    } else {
      console.warn("Kripto para verileri boş döndü.")
      return {}
    }
  } catch (error) {
    console.error("Kripto para verilerini çekerken hata oluştu:", error)
    return {}
  }
}


import axios from "axios";

export const fetchCurrencyData = async () => {
  try {
    const ParaResponse = await axios.get("https://finans.truncgil.com/v4/today.json");

    if (ParaResponse.data) {
      return {
        // USD Alış, Satış ve Değişim Oranı
        USD_Buying: ParaResponse.data.USD?.["Buying"] || "-",
        USD_Selling: ParaResponse.data.USD?.["Selling"] || "-",
        USD_Change: ParaResponse.data.USD?.["Change"] || "0",

        // EUR Alış, Satış ve Değişim Oranı
        EUR_Buying: ParaResponse.data.EUR?.["Buying"] || "-",
        EUR_Selling: ParaResponse.data.EUR?.["Selling"] || "-",
        EUR_Change: ParaResponse.data.EUR?.["Change"] || "0",

        // GBP Alış, Satış ve Değişim Oranı
        GBP_Buying: ParaResponse.data.GBP?.["Buying"] || "-",
        GBP_Selling: ParaResponse.data.GBP?.["Selling"] || "-",
        GBP_Change: ParaResponse.data.GBP?.["Change"] || "0",
      };
    } else {
      console.warn("Para Döviz verileri boş döndü.");
      return {};
    }
  } catch (error) {
    console.error("Para Döviz verilerini çekerken hata oluştu:", error);
    return {};
  }
};

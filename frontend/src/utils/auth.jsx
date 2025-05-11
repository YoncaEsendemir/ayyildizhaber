

// JWT token'ı header'a ekleyen yardımcı fonksiyon
export const getAuthHeader = () => {
    const token = localStorage.getItem("authToken")
    return token ? { Authorization: `Bearer ${token}` } : {}
  }


  // Kullanıcının giriş yapmış olup olmadığını kontrol eden fonksiyon
export const isAuthenticated = () => {
    return !!localStorage.getItem("authToken")
  }
  
  // Logout işlemi için yardımcı fonksiyon
  export const logout = (navigate) => {
    localStorage.removeItem("authToken")
    if (navigate) {
      navigate("/admin/login")
    }
    return true
  }
  
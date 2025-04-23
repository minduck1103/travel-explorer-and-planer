// Biến để theo dõi trạng thái tải
let isLoading = false
let isLoaded = false

// Hàm tải Google Maps API
export async function loadGoogleMapsAPI(): Promise<void> {
  // Nếu đã tải rồi, trả về Promise đã resolve
  if (isLoaded) {
    return Promise.resolve()
  }

  // Nếu đang tải, trả về Promise chờ
  if (isLoading) {
    return new Promise((resolve) => {
      const checkIfLoaded = setInterval(() => {
        if (isLoaded) {
          clearInterval(checkIfLoaded)
          resolve()
        }
      }, 100)
    })
  }

  // Bắt đầu tải
  isLoading = true

  return new Promise((resolve, reject) => {
    try {
      // Lấy URL từ API route
      fetch("/api/maps/google-maps-url")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Không thể lấy URL Google Maps")
          }
          return response.json()
        })
        .then((data) => {
          if (!data.url) {
            throw new Error("URL Google Maps không hợp lệ")
          }

          // Tạo script element
          const script = document.createElement("script")
          script.type = "text/javascript"
          script.async = true
          script.defer = true
          script.src = data.url

          // Xử lý khi tải thành công
          script.onload = () => {
            isLoaded = true
            isLoading = false
            resolve()
          }

          // Xử lý khi tải thất bại
          script.onerror = (error) => {
            isLoading = false
            reject(error)
          }

          // Thêm script vào document
          document.head.appendChild(script)
        })
        .catch((error) => {
          isLoading = false
          reject(error)
        })
    } catch (error) {
      isLoading = false
      reject(error)
    }
  })
}

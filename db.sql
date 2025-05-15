-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Anamakine: db
-- Üretim Zamanı: 15 May 2025, 11:07:17
-- Sunucu sürümü: 9.3.0
-- PHP Sürümü: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `ayyildiajans`
--
CREATE DATABASE IF NOT EXISTS `ayyildiajans` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `ayyildiajans`;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `admin_table`
--

CREATE TABLE `admin_table` (
  `id` int NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `admin_table`
--

INSERT INTO `admin_table` (`id`, `name`, `email`, `password`, `created_at`) VALUES
(2, 'admin1', 'admin1@gmail.com', '$2b$10$2q9aaEkkqH9vi7bnh3kxSOo/icP0BeEzuINwdtY/Ge.zTgXcYq.92', '2025-04-22 09:08:19');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `haberler_table`
--

CREATE TABLE `haberler_table` (
  `haber_id` int NOT NULL,
  `baslik` varchar(160) NOT NULL,
  `ozet` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `haber_metni` text,
  `haber_tarih` timestamp NULL DEFAULT NULL,
  `durum` enum('taslak','yayinda') NOT NULL,
  `olusturma_tarihi` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `guncelleme_tarihi` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `haberler_table`
--

INSERT INTO `haberler_table` (`haber_id`, `baslik`, `ozet`, `haber_metni`, `haber_tarih`, `durum`, `olusturma_tarihi`, `guncelleme_tarihi`) VALUES
(1, 'haber son dakika şok', 'bu bir özet', 'Yeni haber eklensin', '2025-05-07 10:00:00', 'taslak', '2025-05-05 10:29:22', '2025-05-05 20:09:40'),
(4, 'haber son dakika', 'bu bir özet', '<p>merhaba</p>\r\n', '2025-05-28 00:00:00', 'yayinda', '2025-05-09 10:49:19', '2025-05-09 11:08:11');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `haber_fotograflari`
--

CREATE TABLE `haber_fotograflari` (
  `id` int NOT NULL,
  `haber_id` int DEFAULT NULL,
  `resim_link` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `haber_fotograflari`
--

INSERT INTO `haber_fotograflari` (`id`, `haber_id`, `resim_link`) VALUES
(1, 1, '/uploads/1746440961891_62r8zjx8xaf.png'),
(3, 1, '/uploads/1746475780025_xpb8hgq9x6.png'),
(17, 4, '/uploads/1746788890437_cxbk561lt4g.png');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `haber_kategorileri`
--

CREATE TABLE `haber_kategorileri` (
  `haber_id` int NOT NULL,
  `kategori_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `haber_kategorileri`
--

INSERT INTO `haber_kategorileri` (`haber_id`, `kategori_id`) VALUES
(4, 6),
(1, 7);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `haber_videolari`
--

CREATE TABLE `haber_videolari` (
  `id` int NOT NULL,
  `haber_id` int DEFAULT NULL,
  `video_link` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `haber_videolari`
--

INSERT INTO `haber_videolari` (`id`, `haber_id`, `video_link`) VALUES
(1, 1, '/uploads/1746440961918_s7j36wassrb.mp4'),
(3, 1, '/uploads/1746475780029_gbd2yrp1ur7.mp4'),
(14, 4, '/uploads/1746788890439_jmzjdm4yl9e.mp4');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `kategori_table`
--

CREATE TABLE `kategori_table` (
  `id` int NOT NULL,
  `kategori_ad` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `aciklama` text,
  `olusturma_tarihi` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `kategori_table`
--

INSERT INTO `kategori_table` (`id`, `kategori_ad`, `aciklama`, `olusturma_tarihi`) VALUES
(1, 'dünya', 'Dünya Haberler', '2025-04-26 14:04:37'),
(6, 'spor', 'Spor haberler', '2025-04-28 13:50:16'),
(7, 'ekonomi', 'Ekonomi Haberlerasd', '2025-04-29 11:03:06'),
(17, 'son-dakika', 'Son Dakika Haberler', '2025-05-10 10:39:38'),
(18, 'gundem', 'Gündem Haberler', '2025-05-10 13:37:08'),
(19, 'ozel-haber', 'Özel Haber', '2025-05-10 13:38:09'),
(20, 'Siyaset', 'Siyaset Haberler', '2025-05-10 13:38:54'),
(21, 'yasam', 'Yasam Haberler', '2025-05-10 13:39:25'),
(22, 'egıtım', 'Eğıtım Haberler', '2025-05-10 13:39:53'),
(23, 'saglik', 'Sağlık  Haberler', '2025-05-10 13:40:34'),
(24, 'teknoloji', 'Teknoloji Haber', '2025-05-10 13:44:17'),
(25, 'kultur-sanat', 'Kultur Sanat Haberleri', '2025-05-11 13:31:52');

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `admin_table`
--
ALTER TABLE `admin_table`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `haberler_table`
--
ALTER TABLE `haberler_table`
  ADD PRIMARY KEY (`haber_id`);

--
-- Tablo için indeksler `haber_fotograflari`
--
ALTER TABLE `haber_fotograflari`
  ADD PRIMARY KEY (`id`),
  ADD KEY `haber_id` (`haber_id`);

--
-- Tablo için indeksler `haber_kategorileri`
--
ALTER TABLE `haber_kategorileri`
  ADD PRIMARY KEY (`haber_id`,`kategori_id`),
  ADD KEY `kategori_id` (`kategori_id`);

--
-- Tablo için indeksler `haber_videolari`
--
ALTER TABLE `haber_videolari`
  ADD PRIMARY KEY (`id`),
  ADD KEY `haber_id` (`haber_id`);

--
-- Tablo için indeksler `kategori_table`
--
ALTER TABLE `kategori_table`
  ADD PRIMARY KEY (`id`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `admin_table`
--
ALTER TABLE `admin_table`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Tablo için AUTO_INCREMENT değeri `haberler_table`
--
ALTER TABLE `haberler_table`
  MODIFY `haber_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Tablo için AUTO_INCREMENT değeri `haber_fotograflari`
--
ALTER TABLE `haber_fotograflari`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Tablo için AUTO_INCREMENT değeri `haber_videolari`
--
ALTER TABLE `haber_videolari`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Tablo için AUTO_INCREMENT değeri `kategori_table`
--
ALTER TABLE `kategori_table`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `haber_fotograflari`
--
ALTER TABLE `haber_fotograflari`
  ADD CONSTRAINT `haber_fotograflari_ibfk_1` FOREIGN KEY (`haber_id`) REFERENCES `haberler_table` (`haber_id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `haber_kategorileri`
--
ALTER TABLE `haber_kategorileri`
  ADD CONSTRAINT `haber_kategorileri_ibfk_1` FOREIGN KEY (`haber_id`) REFERENCES `haberler_table` (`haber_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `haber_kategorileri_ibfk_2` FOREIGN KEY (`kategori_id`) REFERENCES `kategori_table` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `haber_videolari`
--
ALTER TABLE `haber_videolari`
  ADD CONSTRAINT `haber_videolari_ibfk_1` FOREIGN KEY (`haber_id`) REFERENCES `haberler_table` (`haber_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

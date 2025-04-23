-- MySQL dump 10.13  Distrib 8.0.42, for macos15 (arm64)
--
-- Host: 127.0.0.1    Database: bitepoint
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `file`
--

DROP TABLE IF EXISTS `file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `file` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `file_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `path` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `isPrivate` tinyint DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_516f1cf15166fd07b732b4b6ab0` (`user_id`),
  CONSTRAINT `FK_516f1cf15166fd07b732b4b6ab0` FOREIGN KEY (`user_id`) REFERENCES `sys_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `file`
--

LOCK TABLES `file` WRITE;
/*!40000 ALTER TABLE `file` DISABLE KEYS */;
/*!40000 ALTER TABLE `file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `timestamp` bigint NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_category`
--

DROP TABLE IF EXISTS `sys_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_3ab792e8c4c9c0595bef2c45e8` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_category`
--

LOCK TABLES `sys_category` WRITE;
/*!40000 ALTER TABLE `sys_category` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_config`
--

DROP TABLE IF EXISTS `sys_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_config` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `key` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `value` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `remark` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_config`
--

LOCK TABLES `sys_config` WRITE;
/*!40000 ALTER TABLE `sys_config` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_feedback`
--

DROP TABLE IF EXISTS `sys_feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_feedback` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rating` int NOT NULL,
  `comments` text COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `order_id` varchar(36) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_07e801a86f1c403704e05040b0` (`order_id`),
  CONSTRAINT `FK_07e801a86f1c403704e05040b01` FOREIGN KEY (`order_id`) REFERENCES `sys_order` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_feedback`
--

LOCK TABLES `sys_feedback` WRITE;
/*!40000 ALTER TABLE `sys_feedback` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_menu`
--

DROP TABLE IF EXISTS `sys_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `create_by` int DEFAULT NULL,
  `update_by` int DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `path` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `permission` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `type` tinyint NOT NULL DEFAULT '0',
  `icon` varchar(255) COLLATE utf8mb4_general_ci DEFAULT '',
  `order_no` int DEFAULT '0',
  `component` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_ext` tinyint NOT NULL DEFAULT '0',
  `ext_open_mode` tinyint NOT NULL DEFAULT '1',
  `active_menu` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `keep_alive` tinyint NOT NULL DEFAULT '1',
  `show` tinyint NOT NULL DEFAULT '1',
  `status` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_menu`
--

LOCK TABLES `sys_menu` WRITE;
/*!40000 ALTER TABLE `sys_menu` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_menu_item`
--

DROP TABLE IF EXISTS `sys_menu_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_menu_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `popular` tinyint NOT NULL,
  `status` tinyint NOT NULL,
  `category_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_6647a8561e00f6c00ae4b8312b` (`name`),
  KEY `FK_76b12f937fdc63e1d6ef825249f` (`category_id`),
  CONSTRAINT `FK_76b12f937fdc63e1d6ef825249f` FOREIGN KEY (`category_id`) REFERENCES `sys_category` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_menu_item`
--

LOCK TABLES `sys_menu_item` WRITE;
/*!40000 ALTER TABLE `sys_menu_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_menu_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_menu_item_price`
--

DROP TABLE IF EXISTS `sys_menu_item_price`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_menu_item_price` (
  `id` int NOT NULL AUTO_INCREMENT,
  `price` decimal(10,0) NOT NULL DEFAULT '0',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `menu_item_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_79e62c0b5bc662fce16b2054902` (`menu_item_id`),
  CONSTRAINT `FK_79e62c0b5bc662fce16b2054902` FOREIGN KEY (`menu_item_id`) REFERENCES `sys_menu_item` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_menu_item_price`
--

LOCK TABLES `sys_menu_item_price` WRITE;
/*!40000 ALTER TABLE `sys_menu_item_price` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_menu_item_price` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_notification`
--

DROP TABLE IF EXISTS `sys_notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_notification` (
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `message` text COLLATE utf8mb4_general_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_notification`
--

LOCK TABLES `sys_notification` WRITE;
/*!40000 ALTER TABLE `sys_notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_notification_users`
--

DROP TABLE IF EXISTS `sys_notification_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_notification_users` (
  `notification_id` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `user_id` int NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`notification_id`,`user_id`),
  KEY `FK_74f3976c5ed2dd1a1516d0caca4` (`user_id`),
  CONSTRAINT `FK_74f3976c5ed2dd1a1516d0caca4` FOREIGN KEY (`user_id`) REFERENCES `sys_user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_a398cf349c10cadde306763c004` FOREIGN KEY (`notification_id`) REFERENCES `sys_notification` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_notification_users`
--

LOCK TABLES `sys_notification_users` WRITE;
/*!40000 ALTER TABLE `sys_notification_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_notification_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_order`
--

DROP TABLE IF EXISTS `sys_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_order` (
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `order_time` datetime DEFAULT NULL,
  `total_price` int DEFAULT NULL,
  `status` tinyint NOT NULL DEFAULT '0',
  `customer_id` int DEFAULT NULL,
  `order_group_id` varchar(36) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `table_id` int DEFAULT NULL,
  `reservation_id` int DEFAULT NULL,
  `voucher_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_c2278f741bd58c256e8d1e1c7f6` (`customer_id`),
  KEY `FK_9edd4d28a2628557b60c1db157b` (`order_group_id`),
  KEY `FK_772618862860544e8566be18ba6` (`table_id`),
  KEY `FK_0f7479cd3676d572163f2e63269` (`reservation_id`),
  KEY `FK_d6529d4d2dc6c1f81f3beaa784d` (`voucher_id`),
  CONSTRAINT `FK_0f7479cd3676d572163f2e63269` FOREIGN KEY (`reservation_id`) REFERENCES `sys_reservation` (`id`),
  CONSTRAINT `FK_772618862860544e8566be18ba6` FOREIGN KEY (`table_id`) REFERENCES `sys_table` (`id`),
  CONSTRAINT `FK_9edd4d28a2628557b60c1db157b` FOREIGN KEY (`order_group_id`) REFERENCES `sys_order_group` (`id`),
  CONSTRAINT `FK_c2278f741bd58c256e8d1e1c7f6` FOREIGN KEY (`customer_id`) REFERENCES `sys_user` (`id`),
  CONSTRAINT `FK_d6529d4d2dc6c1f81f3beaa784d` FOREIGN KEY (`voucher_id`) REFERENCES `sys_voucher` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_order`
--

LOCK TABLES `sys_order` WRITE;
/*!40000 ALTER TABLE `sys_order` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_order_group`
--

DROP TABLE IF EXISTS `sys_order_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_order_group` (
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `customer_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `guest_count` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_order_group`
--

LOCK TABLES `sys_order_group` WRITE;
/*!40000 ALTER TABLE `sys_order_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_order_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_order_item`
--

DROP TABLE IF EXISTS `sys_order_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_order_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quantity` tinyint NOT NULL,
  `note` text COLLATE utf8mb4_general_ci,
  `price` decimal(10,0) NOT NULL DEFAULT '0',
  `status` tinyint NOT NULL DEFAULT '1',
  `urged` tinyint NOT NULL DEFAULT '0',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `menu_item_id` int DEFAULT NULL,
  `order_id` varchar(36) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_5d8a4f8bb9a6b4c70dec2c540d0` (`menu_item_id`),
  KEY `FK_2662f7eb0ac838f9b464d05e5cd` (`order_id`),
  CONSTRAINT `FK_2662f7eb0ac838f9b464d05e5cd` FOREIGN KEY (`order_id`) REFERENCES `sys_order` (`id`),
  CONSTRAINT `FK_5d8a4f8bb9a6b4c70dec2c540d0` FOREIGN KEY (`menu_item_id`) REFERENCES `sys_menu_item` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_order_item`
--

LOCK TABLES `sys_order_item` WRITE;
/*!40000 ALTER TABLE `sys_order_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_order_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_payment`
--

DROP TABLE IF EXISTS `sys_payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_payment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `transaction_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `payment_method` tinyint NOT NULL,
  `payment_status` tinyint NOT NULL,
  `payment_time` datetime DEFAULT NULL,
  `paid_amount` int NOT NULL,
  `order_id` varchar(36) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `staff_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_2b62b41a4a50f52642d8347a07` (`order_id`),
  KEY `FK_86a6ca4fcd24deba57ac1218169` (`staff_id`),
  CONSTRAINT `FK_2b62b41a4a50f52642d8347a077` FOREIGN KEY (`order_id`) REFERENCES `sys_order` (`id`),
  CONSTRAINT `FK_86a6ca4fcd24deba57ac1218169` FOREIGN KEY (`staff_id`) REFERENCES `sys_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_payment`
--

LOCK TABLES `sys_payment` WRITE;
/*!40000 ALTER TABLE `sys_payment` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_reservation`
--

DROP TABLE IF EXISTS `sys_reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_reservation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `guest_count` tinyint NOT NULL,
  `customer_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reservation_time` datetime NOT NULL,
  `special_requests` text COLLATE utf8mb4_general_ci,
  `status` tinyint NOT NULL DEFAULT '0',
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_285a4fd174505e944b922f2fe51` (`user_id`),
  CONSTRAINT `FK_285a4fd174505e944b922f2fe51` FOREIGN KEY (`user_id`) REFERENCES `sys_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_reservation`
--

LOCK TABLES `sys_reservation` WRITE;
/*!40000 ALTER TABLE `sys_reservation` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_reservation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_role`
--

DROP TABLE IF EXISTS `sys_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `create_by` int DEFAULT NULL,
  `update_by` int DEFAULT NULL,
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `value` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `remark` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` tinyint DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_223de54d6badbe43a5490450c3` (`name`),
  UNIQUE KEY `IDX_05edc0a51f41bb16b7d8137da9` (`value`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_role`
--

LOCK TABLES `sys_role` WRITE;
/*!40000 ALTER TABLE `sys_role` DISABLE KEYS */;
INSERT INTO `sys_role` VALUES (1,'2025-11-10 00:31:44.058463','2025-01-28 21:08:39.000000',NULL,NULL,'Quản trị viên','admin','',1),(2,'2025-11-10 00:31:44.058463','2025-01-30 18:44:45.000000',NULL,NULL,'Người dùng','customer','',1),(4,'2025-01-23 22:46:52.408827','2025-01-30 01:04:52.000000',NULL,NULL,'Nhân viên','waiter',NULL,1);
/*!40000 ALTER TABLE `sys_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_role_menus`
--

DROP TABLE IF EXISTS `sys_role_menus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_role_menus` (
  `role_id` int NOT NULL,
  `menu_id` int NOT NULL,
  PRIMARY KEY (`role_id`,`menu_id`),
  KEY `IDX_35ce749b04d57e226d059e0f63` (`role_id`),
  KEY `IDX_2b95fdc95b329d66c18f5baed6` (`menu_id`),
  CONSTRAINT `FK_2b95fdc95b329d66c18f5baed6d` FOREIGN KEY (`menu_id`) REFERENCES `sys_menu` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_35ce749b04d57e226d059e0f633` FOREIGN KEY (`role_id`) REFERENCES `sys_role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_role_menus`
--

LOCK TABLES `sys_role_menus` WRITE;
/*!40000 ALTER TABLE `sys_role_menus` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_role_menus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_table`
--

DROP TABLE IF EXISTS `sys_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_table` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `name` varchar(70) COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint NOT NULL DEFAULT '0',
  `show` tinyint NOT NULL DEFAULT '0',
  `table_zone_id` int DEFAULT NULL,
  `table_type_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_c457d2741a69267792cb705755` (`name`),
  KEY `FK_19307bce3a4c3c7b59652bc9f4e` (`table_zone_id`),
  KEY `FK_39ba5427a73a26fda46ea1b282f` (`table_type_id`),
  CONSTRAINT `FK_19307bce3a4c3c7b59652bc9f4e` FOREIGN KEY (`table_zone_id`) REFERENCES `sys_table_zone` (`id`),
  CONSTRAINT `FK_39ba5427a73a26fda46ea1b282f` FOREIGN KEY (`table_type_id`) REFERENCES `sys_table_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_table`
--

LOCK TABLES `sys_table` WRITE;
/*!40000 ALTER TABLE `sys_table` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_table_type`
--

DROP TABLE IF EXISTS `sys_table_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_table_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `name` varchar(70) COLLATE utf8mb4_general_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `max_capacity` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_table_type`
--

LOCK TABLES `sys_table_type` WRITE;
/*!40000 ALTER TABLE `sys_table_type` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_table_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_table_zone`
--

DROP TABLE IF EXISTS `sys_table_zone`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_table_zone` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_a115e1235a4ab8724dd16399a3` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_table_zone`
--

LOCK TABLES `sys_table_zone` WRITE;
/*!40000 ALTER TABLE `sys_table_zone` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_table_zone` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_user`
--

DROP TABLE IF EXISTS `sys_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `username` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `first_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `gender` tinyint NOT NULL DEFAULT '0',
  `birth_date` datetime NOT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `remark` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `psalt` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_9e7164b2f1ea1348bc0eb0a7da` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_user`
--

LOCK TABLES `sys_user` WRITE;
/*!40000 ALTER TABLE `sys_user` DISABLE KEYS */;
INSERT INTO `sys_user` VALUES (1,'2025-04-23 17:47:41.424060','2025-04-23 17:47:41.424060','tiendat','b9a9119b94f4612ba966f8d3638fb606','Phạm','Đạt',0,'2001-08-01 00:46:46',NULL,'tiendatdev12301@gmail.com','0945404365',NULL,'CKi25wnF8v3Woqt14k-glvPegxHupEf5',1);
/*!40000 ALTER TABLE `sys_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_user_roles`
--

DROP TABLE IF EXISTS `sys_user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_user_roles` (
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `IDX_96311d970191a044ec048011f4` (`user_id`),
  KEY `IDX_6d61c5b3f76a3419d93a421669` (`role_id`),
  CONSTRAINT `FK_6d61c5b3f76a3419d93a4216695` FOREIGN KEY (`role_id`) REFERENCES `sys_role` (`id`),
  CONSTRAINT `FK_96311d970191a044ec048011f44` FOREIGN KEY (`user_id`) REFERENCES `sys_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_user_roles`
--

LOCK TABLES `sys_user_roles` WRITE;
/*!40000 ALTER TABLE `sys_user_roles` DISABLE KEYS */;
INSERT INTO `sys_user_roles` VALUES (1,1);
/*!40000 ALTER TABLE `sys_user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_voucher`
--

DROP TABLE IF EXISTS `sys_voucher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_voucher` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `discount` decimal(10,0) NOT NULL,
  `expirationDate` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_7c3e10152481eca17dcc48362f` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_voucher`
--

LOCK TABLES `sys_voucher` WRITE;
/*!40000 ALTER TABLE `sys_voucher` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_voucher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_access_tokens`
--

DROP TABLE IF EXISTS `user_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_access_tokens` (
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `value` varchar(500) COLLATE utf8mb4_general_ci NOT NULL,
  `expired_at` datetime NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `refresh_token_id` varchar(36) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_fd94829a45e1ad609847f8c29b` (`refresh_token_id`),
  CONSTRAINT `FK_fd94829a45e1ad609847f8c29b1` FOREIGN KEY (`refresh_token_id`) REFERENCES `user_refresh_tokens` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_access_tokens`
--

LOCK TABLES `user_access_tokens` WRITE;
/*!40000 ALTER TABLE `user_access_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_refresh_tokens`
--

DROP TABLE IF EXISTS `user_refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_refresh_tokens` (
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `value` varchar(500) COLLATE utf8mb4_general_ci NOT NULL,
  `expired_at` datetime NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_15ffbf3cf712c581611caf2130a` (`user_id`),
  CONSTRAINT `FK_15ffbf3cf712c581611caf2130a` FOREIGN KEY (`user_id`) REFERENCES `sys_user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_refresh_tokens`
--

LOCK TABLES `user_refresh_tokens` WRITE;
/*!40000 ALTER TABLE `user_refresh_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-24  0:52:18
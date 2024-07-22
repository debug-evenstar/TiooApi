-- MySQL dump 10.13  Distrib 8.0.37, for Linux (x86_64)
--
-- Host: localhost    Database: praxeum
-- ------------------------------------------------------
-- Server version	8.0.37-0ubuntu0.22.04.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `onboarding_questions`
--

DROP TABLE IF EXISTS `onboarding_questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `onboarding_questions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parent_id` int DEFAULT NULL,
  `parent_answer` varchar(255) DEFAULT NULL,
  `question` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `options` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `onboarding_questions_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `onboarding_questions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `onboarding_questions`
--

LOCK TABLES `onboarding_questions` WRITE;
/*!40000 ALTER TABLE `onboarding_questions` DISABLE KEYS */;
INSERT INTO `onboarding_questions` VALUES (1,NULL,NULL,'Which of the following best describes you?','single-select','[\"Student\",\"Agent\"]','2024-06-23 05:18:35','2024-06-23 05:18:35'),(2,1,'Student','What are your primary goals for using the platform?','single-select','[\"Coding\",\"Exam Preparation\",\"Learning\"]','2024-06-23 05:18:35','2024-06-23 05:18:35'),(3,7,'JAMB','Which subjects are you most interested in?','multi-select','[\"English\",\"Mathematics\",\"Chemistry\",\"Biology\",\"Literature\",\"Economics\"]','2024-06-23 05:18:35','2024-06-23 05:18:35'),(4,7,'JAMB','How many hours per week can you dedicate to studying?','single-select','[\"< 7 hours\",\"7 hours\",\"> 7 hours\"]','2024-06-23 05:18:35','2024-06-23 05:18:35'),(5,7,'JAMB\n','Would you like an online coach?','single-select','[\"Yes\",\"No\"]','2024-06-23 05:18:35','2024-06-23 05:18:35'),(6,7,'JAMB','How would you like to track your progress?','single-select','[\"Quizes\",\"Assignment\",\"Self-assesment\"]','2024-06-23 05:18:35','2024-06-23 05:18:35'),(7,2,'Exam Preparation','What exams are you preparing for?','single-select','[\"UTME\",\"JAMB\",\"WAEC\", \"NECO\", \"GRE\", \"Aptitude test\", \"ICAN\",\"IELT\"]','2024-06-29 16:48:26','2024-06-29 16:48:26');
/*!40000 ALTER TABLE `onboarding_questions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-22 23:22:34

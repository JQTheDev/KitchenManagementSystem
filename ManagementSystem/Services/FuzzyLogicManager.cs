using System;

namespace ManagementSystem.Services
{
    public class FuzzyLogicManager
    {
        // Define thresholds for calories
        private const double VeryLowCalories = 200;
        private const double LowCalories = 400;
        private const double ModerateCalories = 600;
        private const double HighCalories = 800;
        private const double VeryHighCalories = 1000;

        // Define thresholds for fat
        private const double VeryLowFat = 3;
        private const double LowFat = 10;
        private const double ModerateFat = 17;
        private const double HighFat = 24;
        private const double VeryHighFat = 30;

        // Define thresholds for salt
        private const double VeryLowSalt = 0.3;
        private const double LowSalt = 0.7;
        private const double ModerateSalt = 1.2;
        private const double HighSalt = 1.8;
        private const double VeryHighSalt = 2.3;

        // Score ranges for meal categories
        private const double ScoreVeryHealthy = 8;
        private const double ScoreHealthy = 5;
        private const double ScoreNeutral = 3;
        private const double ScoreUnhealthy = 1;

        // Detailed evaluation based on the input parameters
        public string EvaluateMealNutrition(double calories, double fat, double salt)
        {
            // Start with a score of 0; higher will mean healthier
            double nutritionScore = 0;

            // Evaluate calories
            if (calories <= VeryLowCalories) nutritionScore += 2;
            else if (calories <= LowCalories) nutritionScore += 1;
            else if (calories > HighCalories && calories <= VeryHighCalories) nutritionScore -= 1;
            else if (calories > VeryHighCalories) nutritionScore -= 2;

            // Evaluate fat
            if (fat <= VeryLowFat) nutritionScore += 2;
            else if (fat <= LowFat) nutritionScore += 1;
            else if (fat > HighFat && fat <= VeryHighFat) nutritionScore -= 1;
            else if (fat > VeryHighFat) nutritionScore -= 2;

            // Evaluate salt
            if (salt <= VeryLowSalt) nutritionScore += 2;
            else if (salt <= LowSalt) nutritionScore += 1;
            else if (salt > HighSalt && salt <= VeryHighSalt) nutritionScore -= 1;
            else if (salt > VeryHighSalt) nutritionScore -= 2;

            // Determine labels based on scores
            if (nutritionScore >= ScoreVeryHealthy)
                return "Very Healthy";
            else if (nutritionScore >= ScoreHealthy)
                return "Healthy";
            else if (nutritionScore >= ScoreNeutral)
                return "Neither";
            else if (nutritionScore >= ScoreUnhealthy)
                return "Unhealthy";
            else
                return "Very Unhealthy";
        }
    }

}

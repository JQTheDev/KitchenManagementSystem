using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using NuGet.ContentModel;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


namespace ManagementSystem.Models
{
    public class MealIngredient
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MealIngredientId { get; set; }

        [Required]
        public int MealId { get; set; }

        [Required]
        public int IngredientId { get; set; }

        [Required]
        public float Quantity { get; set; }

        [ForeignKey("MealId")]
        [JsonIgnore]
        public virtual Meal Meal { get; set; }

        [ForeignKey("IngredientId")]
        [JsonIgnore]
        public virtual Ingredient Ingredient { get; set; }

        public MealIngredient()
        {
            
        }
    }
}

using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using NuGet.ContentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


namespace ManagementSystem.Models
{
    public class Meal
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MealId { get; set; }

        [Required]
        public string Name { get; set; }
        
        [NotMapped]
        public decimal Price
        {
            get
            {
                if (MealIngredients == null)
                    return 0m;

                return MealIngredients.Sum(mi => mi.Ingredient != null ? mi.Quantity * mi.Ingredient.Price : 0m);
            }
        }

        [JsonIgnore]
        public virtual ICollection<MealIngredient> MealIngredients { get; set; }

        public Meal()
        {
            MealIngredients = new HashSet<MealIngredient>();
        }

    }
}

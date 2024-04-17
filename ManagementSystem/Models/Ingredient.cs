using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using NuGet.ContentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


public class Ingredient
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int IngredientId { get; set; }
    [Required]
	public string Name { get; set; }

	public int? Calories { get; set; }

    public float? Salt { get; set; }

    public float? Fat { get; set; }
    [Required]
    public int Quantity { get; set; } = 0;

    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }

    public Ingredient()
	{
		//Blank for Db Context DB configuration
		
	}
}

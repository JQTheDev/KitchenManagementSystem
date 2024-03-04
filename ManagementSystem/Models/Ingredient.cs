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

    public int? Salt { get; set; }

    public int? Fat { get; set; }

    public int? Quantity { get; set; }

    public Ingredient()
	{
		//Blank for Db Context DB configuration
		
	}
}

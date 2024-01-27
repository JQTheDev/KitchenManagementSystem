using ManagementSystem.Controllers;
using Microsoft.AspNetCore.Mvc;
using NuGet.ContentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ManagementSystem.Models
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserId {  get; set; }

        public string Username{  get; set; }

        public string Password{  get; set; }

        public User  ()
        {
            
        }

    }

    
}

using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace ManagementSystem.Models
{
 
    public class Funding
    {
        [Key]
        public int FundingId { get; set; }
        public int Amount { get; set; }

        public Funding()
        {
            
        }
    }
}

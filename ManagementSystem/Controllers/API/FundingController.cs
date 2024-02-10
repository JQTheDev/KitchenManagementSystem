﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ManagementSystem.Models;

namespace ManagementSystem.Controllers.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class FundingController : ControllerBase
    {
        private readonly MyDbContext _context;

        public FundingController(MyDbContext context)
        {
            _context = context;
        }

        // GET: api/Funding
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Funding>>> GetFunding()
        {
            return await _context.Funding.ToListAsync();
        }

        // GET: api/Funding/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Funding>> GetFunding(int id)
        {
            var funding = await _context.Funding.FindAsync(id);

            if (funding == null)
            {
                return NotFound();
            }

            return funding;
        }

        // PUT: api/Funding/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFunding(int id, Funding funding)
        {
            if (id != funding.FundingId)
            {
                return BadRequest();
            }

            _context.Entry(funding).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FundingExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Funding
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Funding>> PostFunding(Funding funding)
        {
            _context.Funding.Add(funding);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFunding", new { id = funding.FundingId }, funding);
        }

        // DELETE: api/Funding/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFunding(int id)
        {
            var funding = await _context.Funding.FindAsync(id);
            if (funding == null)
            {
                return NotFound();
            }

            _context.Funding.Remove(funding);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FundingExists(int id)
        {
            return _context.Funding.Any(e => e.FundingId == id);
        }
    }
}

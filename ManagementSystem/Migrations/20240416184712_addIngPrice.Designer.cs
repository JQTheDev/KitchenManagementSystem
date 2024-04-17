﻿// <auto-generated />
using System;
using ManagementSystem.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace ManagementSystem.Migrations
{
    [DbContext(typeof(MyDbContext))]
    [Migration("20240416184712_addIngPrice")]
    partial class addIngPrice
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Ingredient", b =>
                {
                    b.Property<int>("IngredientId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("IngredientId"));

                    b.Property<int?>("Calories")
                        .HasColumnType("int");

                    b.Property<float?>("Fat")
                        .HasColumnType("real");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<decimal>("Price")
                        .HasColumnType("decimal(18,2)");

                    b.Property<int>("Quantity")
                        .HasColumnType("int");

                    b.Property<float?>("Salt")
                        .HasColumnType("real");

                    b.HasKey("IngredientId");

                    b.ToTable("Ingredient");
                });

            modelBuilder.Entity("ManagementSystem.Models.Funding", b =>
                {
                    b.Property<int>("FundingId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("FundingId"));

                    b.Property<int>("Amount")
                        .HasColumnType("int");

                    b.HasKey("FundingId");

                    b.ToTable("Funding");
                });

            modelBuilder.Entity("ManagementSystem.Models.Meal", b =>
                {
                    b.Property<int>("MealId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("MealId"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("MealId");

                    b.ToTable("Meal");
                });

            modelBuilder.Entity("ManagementSystem.Models.MealIngredient", b =>
                {
                    b.Property<int>("MealIngredientId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("MealIngredientId"));

                    b.Property<int>("IngredientId")
                        .HasColumnType("int");

                    b.Property<int>("MealId")
                        .HasColumnType("int");

                    b.Property<float>("Quantity")
                        .HasColumnType("real");

                    b.HasKey("MealIngredientId");

                    b.HasIndex("IngredientId");

                    b.HasIndex("MealId");

                    b.ToTable("MealIngredient");
                });

            modelBuilder.Entity("ManagementSystem.Models.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("UserId"));

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserId");

                    b.ToTable("User");
                });

            modelBuilder.Entity("ManagementSystem.Models.MealIngredient", b =>
                {
                    b.HasOne("Ingredient", "Ingredient")
                        .WithMany()
                        .HasForeignKey("IngredientId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ManagementSystem.Models.Meal", "Meal")
                        .WithMany("MealIngredients")
                        .HasForeignKey("MealId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Ingredient");

                    b.Navigation("Meal");
                });

            modelBuilder.Entity("ManagementSystem.Models.Meal", b =>
                {
                    b.Navigation("MealIngredients");
                });
#pragma warning restore 612, 618
        }
    }
}
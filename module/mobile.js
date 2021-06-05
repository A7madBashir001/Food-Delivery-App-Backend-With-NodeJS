const express=require("express");
const Router=express.Router();
const sql=require("mssql");
const config=require('./connect.js').config
Router.use(function(req,res,next){    
    next();
})
//  You Should undertande where you want to set the authenticate So Each post or get method request you should
//  Use The Authraization For Check The Customer Or User, obviously  you will use shared preferences in mobile app
//  And Coockies For Web, To Store The Token Of Users Or Customers
Router
    .route("/Info")
    .get((req,res)=>{
    res.send("<h2>Welcome To API Mobile Device</h2> <p>Here You Will Send All Data And Get Data From Mobile App To SQL Server DataBase</p> <p>So All Of Mobile Information Will know Here And Work Here</p>");   
});
    //        GET THE DATA FROM MEAL TABLE IN THE DATABASE
Router
    .route("/Meal").get( async (req, res) => {
      const result = await sql.query`select * from meal`;
      //select [me_id],[description],[price],[image],[name] from [DB_A6F580_FoodDelivery01].[dbo].[meal]
      res.status(200).json([...result.recordset]);
    });
    //Search Meal By Name In the DataBase
Router
    .route("/Meal/SearchMeal/:name")
    .get((req, res) => {
    searchmeal(req.params.name)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {});
    })
async function searchmeal(name) {
    try {
      let pool = await sql.connect(config);
      let insertProduct = await pool
        .request()
        .input("name", sql.NVarChar, name)
        .execute("Searchmeal");
      return insertProduct.recordsets[0];
    } catch (err) {
      console.log(err);
    }
  }        
//Meal By ID for one screen...
Router
  .route('/Meal/ById/:m_id')
  .get(async(req,res)=>{
    const result=await sql.query(`select * from meal where m_id=${req.params.m_id}`);
    res.status(200).json([...result.recordset]);
  })
//Meals By Resturant ID 
Router
  .route('/Meal/ByResturantId/:rest_id')
  .get(async(req,res)=>{
    const result=await sql.query(`select meal.m_id ,meal.m_name, meal.image, meal.price ,meal.m_count ,meal.Description from have,meal where rest_id=${req.params.rest_id}`);
    res.status(200).json([...result.recordset]);
  })

module.exports=Router;
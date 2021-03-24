'use strict'
const router = require("express").Router();
const { QueryTypes } = require('sequelize');
const schema = process.env.DB_SCHEMA
const table = `sales`

let allRoutes = ({app, models})=>{

    router.post("/save", (req, res) => {

        let { Sales } = models
        let salesData = req.body || {}

        if(!salesData.amount || !salesData.date || !salesData.username){
            return res.json({
                message:`amount, date, username are the required fields!`
            })
        }

        // Save sales data in the database
        Sales.create(salesData)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the sales record!"
                });
            });
    })

    router.get("/fetch/:statusType", async(req, res) => {

        let { Sales } = models
        let { sequelize } = Sales
        let { statusType } = req.params
        let query

        if(statusType==='daily'){
            query = `select  extract(month from date) as month_of_year, extract(day from date) as day_of_month,extract(hour from date) as hour_of_day  , sum(cast (amount as numeric)) 
                     from ${schema}.${table}
                     group by  extract(month from date), extract(day from date),extract(hour from date)
                     order by  month_of_year ,day_of_month,hour_of_day desc;`

        }
        else if(statusType==='weekly'){
            query = `select extract(week from date) as week_of_year , sum(cast (amount as numeric)) 
                     from ${schema}.${table}
                     group by  extract(week from date) 
                     order by week_of_year desc`

        }
        else if(statusType==='monthly'){
            query = `select  extract(month from date) as month_of_year , sum(cast (amount as numeric)) 
                     from ${schema}.${table}
                     group by extract(month from date) 
                     order by month_of_year desc;`

        }else{
            return res.json({message:'Invalid status type provided, must be from (daily,weekly,monthly)'})
        }

        await sequelize.query(
            query,
            {
                type: QueryTypes.SELECT
            }
        ).then(data=>res.send(data))
    })

    return router
}

module.exports = allRoutes

exports.RouteGetSomething = function(req,res)
{
    res.status(200).json({"value":"hello world", "params":req.params});
}
exports.RoutePostSomething = function(req,res)
{
    res.status(200).json({"params=":req.params,"body":req.body});
}

exports.getLoginPage =function(req, res) {
    
    res.render('login.ejs', {
        title: "Welcome to CRM Application"
        ,message: ''
        
    });
};
exports.validateLogin=function (req, res){
    
    mysql=require("mysql");
    let psno = req.body.psno;
    let pwd = req.body.pwd;
    console.log(psno);

    let usernameQuery = "SELECT count(*) as numcount FROM `login` WHERE username = '" + psno + "'and password='" + pwd + "'" ;
    const db = mysql.createConnection ({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'socka'
    });
    
    // connect to database
    db.connect((err) => {
        if (err) {
            throw err;
        }
        console.log(usernameQuery,"query");
    });
    db.query(usernameQuery, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        console.log(result[0].numcount,"value");
        if (result[0].numcount> 0) {
            message = 'Login successful';
            res.redirect('/home');
           
        } else {
            res.redirect('/');
            message = 'Incorrect Credentials';
        }

    });
};

exports.getHomePage =function(req, res) {
    mysql=require("mysql");
    let query = "SELECT * FROM `players` ORDER BY id ASC"; // query database to get all the players
    const db = mysql.createConnection ({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'socka'
    });
    
    // connect to database
    db.connect((err) => {
        if (err) {
            throw err;
        }
        console.log('Connected to database');
    });
    //global.db = db;
    // execute query
    db.query(query, (err, result) => {
        
        if (err) {
            res.redirect('/');
            console.log("errorrr");
        }
        res.render('home.ejs', {
            title: "Welcome to CRM Application"
            ,players: result
            
        });
     // res.getEmpPage;
    });
};

exports.getLeadPage =function(req, res) {
    mysql=require("mysql");
    let query = "SELECT * FROM `players` ORDER BY id ASC"; // query database to get all the players
    const db = mysql.createConnection ({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'socka'
    });
    
    // connect to database
    db.connect((err) => {
        if (err) {
            throw err;
        }
        console.log('Connected to database');
    });
    //global.db = db;
    // execute query
    db.query(query, (err, result) => {
        
        if (err) {
            res.redirect('/');
            console.log("errorrr");
        }
        res.status(200).json(result);
     // res.getEmpPage;
    });
};
exports.getEmpPage =function(req, res) {
    mysql=require("mysql");
   
    let query = "SELECT * FROM `employee` ORDER BY empid ASC"; // query database to get all the players
    const db = mysql.createConnection ({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'socka'
    });
    console.log(query,"emp");
    // connect to database
    db.connect((err) => {
        if (err) {
            throw err;
        }
        console.log('Connected to database');
    });
    //global.db = db;
    // execute query
    db.query(query, (err, result) => {
        
        if (err) {
            res.redirect('/');
            console.log("errorrr");
        }
        res.status(200).json(result);
       // res.render('employee.ejs', {
            //title: "Welcome to CRM Application"
           // ,employee: result
            
        //});
      
    });
};

exports.addLeadPage=function (req, res) {
    res.render('add-player.ejs', {
        title: "Welcome to Socka | Add a new player"
        ,message: ''
    });
};
exports.addLead=function (req, res){
    console.log(req);
    if (!req.files==0) {
        return res.status(400).send("No files were uploaded.");
    }

    let message = '';
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let position = req.body.position;
    let number = req.body.number;
    let username = req.body.username;
   
    let usernameQuery = "SELECT * FROM `players` WHERE user_name = '" + username + "'";
    const db = mysql.createConnection ({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'socka'
    });
    
    // connect to database
    db.connect((err) => {
        if (err) {
            throw err;
        }
        console.log('Connected to database');
    });
    db.query(usernameQuery, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.length > 0) {
            message = 'Leadname already exists';
            res.render('add-player.ejs', {
                message,
                title: "Welcome to Socka | Add a new player"
            });
        } else {
            // check the filetype before uploading it
         
                    let query = "INSERT INTO `players` (first_name, last_name, position, number, user_name) VALUES ('" +
                        first_name + "', '" + last_name + "', '" + position + "', '" + number + "',  '" + username + "')";
                    console.log(query);
                        db.query(query, (err, result) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        res.redirect('/home');
                    });
        }
    });
};
exports.editLeadPage= function(req, res){
    let playerId = req.params.id;
    let query = "SELECT * FROM `players` WHERE id = '" + playerId + "' ";
    const db = mysql.createConnection ({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'socka'
    });
    
    // connect to database
    db.connect((err) => {
        if (err) {
            throw err;
        }
        console.log('Connected to database');
    });
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.render('edit-player.ejs', {
            title: "Edit Lead"
            ,player: result[0]
            ,message: ''
        });
    });
},
exports.editLead=function(req, res){
    let playerId = req.params.id;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let position = req.body.position;
    let number = req.body.number;

    let query = "UPDATE `players` SET `first_name` = '" + first_name + "', `last_name` = '" + last_name + "', `position` = '" + position + "', `number` = '" + number + "' WHERE `players`.`id` = '" + playerId + "'";
    const db = mysql.createConnection ({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'socka'
    });
    
    // connect to database
    db.connect((err) => {
        if (err) {
            throw err;
        }
        console.log('Connected to database');
    });
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.redirect('/home');
    });
};
exports.deleteLead= function (req, res){
    mysql=require("mysql");
    let playerId = req.params.id;
    let deleteUserQuery = 'DELETE FROM players WHERE id = "' + playerId + '"';
    const db = mysql.createConnection ({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'socka'
    });
    
    // connect to database
    db.connect((err) => {
        if (err) {
            throw err;
        }
        console.log('Connected to database');
    });
        db.query(deleteUserQuery, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.redirect('/home');
            });
    
  
}
exports.getBackPage=function (req, res) {
    res.render('login.ejs', {
        title: "Welcome to Crm Application"
        ,message: ''
    });
};
exports.addContactPage=function (req, res){
    mysql=require("mysql");
    
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let account = req.body.account;
    let jobtitle = req.body.job_title;
    let function1 = req.body.function1;
    let department = req.body.department;
    let phone = req.body.phone;
    let city = req.body.city;
    let fax = req.body.fax;
    let mobile = req.body.mobile;
    let email = req.body.email;
 

    let query = "INSERT INTO `contact` (firstname, lastname, accountname, jobtitle, functionname,department,phone,city,fax,mobile,email) VALUES ('" +
    first_name + "', '" + last_name + "', '" + account + "', '" + jobtitle + "','" + function1 + "','" +
    department + "','" + phone + "','" + city + "','" + fax + "','" + mobile + "','" +
    email + "')";
   console.log(query);
    const db = mysql.createConnection ({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'socka'
    });
    
    // connect to database
    db.connect((err) => {
        if (err) {
            throw err;
        }
        console.log('Connected to database');
    });
    db.query(query, (err, result) => {
        if (err) {
            console.log("error contact");
            return res.status(500).send(err);
        }
        
             res.redirect('/showContact');
        
    });
};

exports.ContactPage=function (req, res)  {
   
    let query = " SELECT * FROM `contact` ORDER BY mobile ASC;"; // query database to get all the players
    mysql=require("mysql");
   // query database to get all the players
    const db = mysql.createConnection ({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'socka'
    });
    console.log(query,"emp");
    // connect to database
    db.connect((err) => {
        if (err) {
            throw err;
        }
        console.log('Connected to database');
    });
    //global.db = db;
    // execute query
    db.query(query, (err, result) => {
        
        if (err) {
            res.redirect('/');
            console.log("errorrr");
        }
        res.status(200).json(result);
      
      
    });
};

exports.addAccountPage= function(req, res){
    console.log("welcome to function");
     let message = '';
     let name = req.body.nam;
   
     let status= req.body.check;
     
     let parentaccount = req.body.paacc;
    
     let website = req.body.web;
   
     let accountcategory= req.body.acccat;
    
     let vertical= req.body.vert;
    
     let cont= req.body.country;

     let cit= req.body.city;
 
     let stat= req.body.state;
     
     let own= req.body.owner;

         

                     // send the account details to the database
                     let query = "INSERT INTO `account` (name,prospect, parentaccount,website,accountcategory,vertical,country,city,state,owner) VALUES ('" +
                     name + "', '" + status + "','" + parentaccount + "', '" + website + "','" + accountcategory + "','" + vertical + "','" + cont + "','" + cit + "','"+ stat+"','" + own + "')";
                     console.log(query);
                     mysql=require("mysql");
    const db = mysql.createConnection ({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'socka'
    });
    
    // connect to database
    db.connect((err) => {
        if (err) {
            throw err;
        }
        console.log('Connected to database');
    });
                     db.query(query, (err, result2) => {
                         if (err) {
                             return res.status(500).send(err);
                         }
                       res.redirect("/home")
                     });
                 
         

 };
 exports.getAccountPage= function(req, res){
 
mysql=require("mysql");
   
let query = "SELECT * FROM `account`"; // query database to get all the players
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'socka'
});
console.log(query,"emp");
// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
//global.db = db;
// execute query
db.query(query, (err, result) => {
    
    if (err) {
        res.redirect('/');
        console.log("errorrr");
    }
    res.status(200).json(result);
  
  
});
 };



exports.getOpportunityPage= function(req, res){
    let query1= "select * from opportunities order by id ASC";
    mysql=require("mysql");
    const db = mysql.createConnection ({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'socka'
    });
    console.log(query1);
        db.query(query1, (err, result2) => {
          if (err) {
          res.redirect('/');
          }
        res.status(200).json(result2);
    });
},

exports.addOpportunity=function (req, res){
 console.log("function entred")
    let message = '';
    let Name = req.body.Name;
    let Account = req.body.Account;
    let PrimaryContact = req.body.PrimaryContact;
    let Source= req.body.Source;
    let Exceptedvalue = req.body.Exceptedvalue;
    let StartDate = req.body.StartDate;
    
    let ClosingDate = req.body.ClosingDate;
    let SalesCycle  = req.body.SalesCycle;
    let Salesphase = req.body.Salesphase;
   
    let Probability  = req.body.Probability;
    let ForecastCategory = req.body.ForecastCategory;
    let Category = req.body.Category;
    let Owner = req.body.Owner
    

    
   let query = "INSERT INTO `opportunities` (name,account,primarycontact,source,exceptedvalue,startdate,closedate,salescycle,salesphase,probability,forecastcategory,category,owner) VALUES ('" +
     Name + "', '" + Account + "','" + PrimaryContact + "', '" + Source + "','" + Exceptedvalue +
      "','" + StartDate + "','" + ClosingDate + "','" +SalesCycle + "','"+ Salesphase +"','" +
      Probability + "','" + ForecastCategory + "','" + Category + "','" + Owner + "')"; 
     
     mysql=require("mysql");
     const db = mysql.createConnection ({
         host: 'localhost',
         user: 'root',
         password: 'password',
         database: 'socka'
     });
     db.query(query, (err, result) => {
          if (err) {
            return res.status(500).send(err);
                        }
               res.redirect("/home")
                    });
   
};
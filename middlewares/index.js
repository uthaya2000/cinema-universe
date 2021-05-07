var middleware = {};

middleware.isLoggedIn = (req, res, next)=>{
    //console.log(req.user);
    if(!req.isAuthenticated()){
        return res.redirect("/login");
    }
    return next();
}

middleware.checkAdmin = (req, res, next)=>{
    if(req.isAuthenticated())
    {
        const checkmail = req.user.email;
        if(checkmail == "uthaya.sankar1008@outlook.com")
        {
            next();
        }else
        {
            res.send("Your not allowed to this page")
        }
    }else
    {
        res.redirect('/login')
    }
}

module.exports = middleware;
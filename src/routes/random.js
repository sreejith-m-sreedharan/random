
module.exports =  function (app, router){
    
    router.use('/predict', function(req, res , next){
        return res.json({"status":"ok"});
    });
    return router;
}
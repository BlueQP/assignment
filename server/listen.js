module.exports = {
    listen: function(app, PORT){
        app.listen(PORT, ()=> {
            let d = new Date();
            let h = d.getHours();
            let m = d.getMinutes();
            console.log('From listen: server has been up on port ' 
            + PORT + ' since: ' + h + ':' + m);
        });
    }
}
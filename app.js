var fs = require('fs');
var path = require('path');
var mergeJSON = require("merge-json"); //https://www.npmjs.com/package/merge-json

var DATA_FOLDER = 'DOWNLOADED_DATA';
var distinct = [];
var count = 0;
var list_of_countries = ['Afghanistan','Albania','Argentina','Armenia','Australia','Bangladesh','Barbados','Belgium','Bhutan','Brazil','Burma','Burundi','Cambodia','Canada','Chile','China','Colombia','Cuba','Cyprus','East_Timor','England','Estonia','Fiji','France','Georgia','Germany','Haiti','Iceland','India','Indonesia','Ireland','Israel','Italy','Japan','Kenya','Latvia','Lebanon','Malaysia','Malta','Mexico','Nepal','Netherland','Peru','Philippine','Poland','Russia','Rwanda','Serbia','Singapore','Slovenia','Spain','Sudan','Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania','Tonga','USA','Vietnam']; //add country name folder here
var MASTER_FOLDER = 'MASTER_FOLDER' ;

//check if master folder exists..if not create it
fs.existsSync(MASTER_FOLDER, function (exists) {
    if (exists) {
        // console.log(exists)
    }
    else {
        console.log("creating master folder");
        fs.mkdir(MASTER_FOLDER,function(err){
            if(err)
                console.log(err);
        })
    }
});

// copy all the files from the first folder to the master folder
fs.readdirSync(DATA_FOLDER+path.sep+list_of_countries[0]).forEach(function(file){
    // https://github.com/jprichardson/node-fs-extra/issues/320
    fs.copyFileSync(DATA_FOLDER+path.sep+list_of_countries[0]+path.sep+file,MASTER_FOLDER+path.sep+file,err=>{

        if(err) throw err;
        console.log(file+' was copied to '+master_folder);
    });
   
    
});


fs.readdirSync(MASTER_FOLDER).forEach(function(file){
    console.log('initial conf' + file);
    
})

//start from the 2nd folder & send all the folders to add the files
for(var i = 1;i<list_of_countries.length;i++){

    collaborate(list_of_countries[i]);
}


//join two folders
function collaborate(country_folder){

    var x = [] ,y = [];

    //get files in the master folder 
    fs.readdirSync(MASTER_FOLDER).forEach(function(file){
        x.push(file);
        
        
    })

   

    var fileSeparator = path.sep;
    var country = DATA_FOLDER + fileSeparator + country_folder;

    //get files in the other folder 
    fs.readdirSync(country).forEach(function(file){
        y.push(file);
    })

    //x and y array now contains files present in master folder and one country respectively

    
    var match_file=false;

    for(var i=0;i<y.length;i++){ //iterate through all new folders
        for(var j=0;j<x.length;j++){ //iterate through master folder
            
            //if there is a match then set the flag as true
            if(y[i] == x[j]){
                match_file = true;
                // console.log(country_folder)
                copy_content(y[i],x[j],country_folder); //copy content (new_content, masterfile, countryname)
            }
                
                        
        }
        //if no match is found then it is distinct file, push it in
        if(!match_file){
            distinct.push(y[i]);
            console.log(y[i] + ' pushed');
        }  
        match_file = false; //set it true for next cycle
    }
    // console.log(distinct);
    copy_file(country,MASTER_FOLDER,distinct);

   distinct = [];
    
}


function copy_file(country,master_folder,distinct) {

    distinct.forEach(function(file){
        //copy all the distinct files to master folder
        // https://github.com/jprichardson/node-fs-extra/issues/320
        fs.copyFileSync(country+path.sep+file,master_folder+path.sep+file,err=>{

            if(err) throw err;
            console.log(file+' was copied to '+master_folder);
        });
    });
}


function copy_content(source_file,destination_file,country_name){

    var source_filename = DATA_FOLDER+path.sep+country_name+path.sep+source_file;
    var destination_filename = MASTER_FOLDER+path.sep+destination_file;

    var source_data = fs.readFileSync(source_filename);
    var destination_data = fs.readFileSync(MASTER_FOLDER+path.sep+destination_file);

    var source =JSON.parse(source_data);
    var destination = JSON.parse(destination_data);

    var result = mergeJSON.merge(source, destination) ;
    
    console.log(result);

    //write it back to the master folder
    fs.writeFileSync(destination_filename,JSON.stringify(result,null,2));
}
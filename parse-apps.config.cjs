module.exports = {
    apps : [
      {
        name        : "api",
        script      : "yarn start",
        watch       : false,
        merge_logs  : true,
        cwd         : "."
  
       },
       {
        name        : "schedule",
        script      : "yarn schedule",
        watch       : false,
        merge_logs  : true,
        cwd         : "."
  
       }
    ]
  }
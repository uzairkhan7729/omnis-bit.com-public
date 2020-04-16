'use strict';
var express = require('express');
var router = express.Router();
const History= require('./models').history;
const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const GroupUser=require('./models').botGroupUsers;

var state = {};

//const BOT_TOKEN = "771344038:AAF42lrCivI-p6hRA22CxpbNYBbcIc_meFE";
//const BOT_TOKEN = "738800748:AAHeGg3nWemlLEsPZ-KvnJgA_rfKRPP8CWI";
const BOT_TOKEN = "738800748:AAEALujrA1kpqGNDBylqaoL2s9wiSgpKFOI";

// Create a bot that uses 'polling' to fetch new updates
const bot = new Telegraf(BOT_TOKEN,{polling: true});


const User = require('./models').Account;
const Ban = require('./models').Ban;

var banned_patterns = [
/.*(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]).*/i,
/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i

]

const config = require('./config');
const adminsList = config.admins;





bot.start((ctx) => {
try{
   let user = ctx.update.message.from.username;
}
catch(err)
{
   ctx.reply(err);
}
});

bot.hears('🔑 New password', (ctx) => {
   try{
   ctx.reply('Keyboard Deleted', Markup.removeKeyboard().extra())
   ctx.reply("Enter your New Password") 
   const userId = ctx.message.from.id;
   if (!state[userId]) state[userId] = { id: userId };
  state[userId].command = '🔑 New password';
}
catch(err){
   ctx.reply(err);
}
  })
  bot.hears('🔍 Verification', (ctx) => {
     try{
   ctx.reply('Keyboard Deleted', Markup.removeKeyboard().extra())
   ctx.reply("Enter your verification code") 
   const userId = ctx.message.from.id;
   if (!state[userId]) state[userId] = { id: userId };
  state[userId].command = '🔍 Verification';
}
catch(err){
   ctx.reply(err);
}
  })

 bot.command('OMNISrain',async(ctx)=>{
     try{
	let user=ctx.message.from.username;
	if (adminsList.indexOf(user) > -1) 
   {
	   const params = {username: ctx.message.from.username,userverify:'',groupmember:true};
	   User.find( params , (err, users)=> {
		 if(users)
		 {
			 ctx.reply(users);
		 }
	 })
   }
}catch(err){
   ctx.reply(err);
}
   
  })

bot.command('joinrain',async(ctx)=>{
try{
     const params = {username: ctx.message.from.username};
   User.findOne( params, (err, user)=> {
	 if(user) {
		 if(user.groupmember == true){
			  ctx.telegram.sendMessage(ctx.message.chat.id, `Already Joined`);
		 }else{
			 user.groupmember=true;
			 user.save();
			 ctx.telegram.sendMessage(ctx.message.chat.id, `You are now added in OMNIS rain`);	 
		 }
		 
		 
		 
	 }else{
		 ctx.telegram.sendMessage(ctx.message.chat.id, `This user does not exist`);	 
	 }
	 
	 })

}catch(err){
   ctx.reply(err);
}
   
  })
  
 bot.command('bestearner',async(ctx)=>{
try{
	let user=ctx.message.from.username;
	if (adminsList.indexOf(user) > -1) {
     const params = {};
   User.find({}).sort('-omnisbitScore').limit(3).exec(function async(err,users){

      ctx.telegram.sendMessage(ctx.message.chat.id,`Top 3 Earners:` +` \n` +`🥇 @`+users[0].username+`: `+users[0].omnisbitScore );	 
      setTimeout(function(){
         ctx.telegram.sendMessage(ctx.message.chat.id,`🥈 @`+users[1].username+`: `+users[1].omnisbitScore);	 
          
      },100) 
      	 
      setTimeout(function(){
         ctx.telegram.sendMessage(ctx.message.chat.id,`🥉 @`+users[2].username+`: `+users[2].omnisbitScore);	
          
      },200) 
      
      
      
      
      
      
   });
	
	}
}catch(err){
   ctx.reply(err);
}
   
  })
  
  bot.hears('📊 myomnisbit', (ctx) => {
     try{
   const params = {username: ctx.message.from.username};
   User.findOne( params, (err, user)=> {
   if(user) {


            if(!err && ctx.message.chat.type=="private") {
               const omnis = user.omnisbitScore || 0;
               ctx.telegram.sendMessage(ctx.message.chat.id, `Your OmnisBit score is ${omnis} .`);
            }else{
               ctx.telegram.sendMessage(ctx.message.chat.id,`These are Confidential information, to check your OMNIS, press this button in private @OmnisBitBot`);
            }
         

      }
   });
}catch(err){
   ctx.reply(err);
}
  })

  bot.hears('👥 myreferrals', (ctx) => {
     try{
   const params = {username: ctx.message.from.username};
   User.findOne( params, (err, user)=> {

               if(user) {
      
      
                     if(!err && ctx.message.chat.type=="private") {
                        const referrals = user.referralScore || 0;
                        ctx.telegram.sendMessage(ctx.message.chat.id, `Your Referral score is ${referrals} .`);
                     }else{
                        ctx.telegram.sendMessage(ctx.message.chat.id, `This is Confidential information. To check your Refferal, Hit button in private.`);
                     }
                  
      
               }
            });
      
         }
         catch(err){
            ctx.reply(err);
         }
  })

bot.hears('hi', (ctx) => ctx.reply('Welcome, please read the pinned message'))
bot.hears('Hi', (ctx) => ctx.reply('Welcome, please read the pinned message'))

bot.hears('/deletekeyboard', (ctx) => {
   ctx.reply('Keyboard Deleted', Markup.removeKeyboard().extra())
})

bot.hears('/enablekeyboard', (ctx) => {
   try{
   if(ctx.message.chat.type=="private"){
   ctx.reply('Keyboard Enabled', 
   
   Markup
   .keyboard([
     ['🔍 Verification', '🔑 New password'], // Row1 with 2 buttons
     ['📊 myomnisbit', '👥 myreferrals'], // Row2 with 2 buttons
     ['📢 Task', '⭐️ Airdrop', '👜 Add wallet'], // Row3 with 3 buttons
     
   ])
   .oneTime()
   .resize()
   .extra()
   
   
   )
}}
catch(err){
   ctx.reply(err);
}
})



bot.hears('hello', (ctx) => ctx.reply('Welcome, please read the pinned message'))
bot.hears('Hello', (ctx) => ctx.reply('Welcome, please read the pinned message'))

bot.hears('bye', (ctx) => ctx.reply('Welcome, please read the pinned message'))
bot.hears('Bye', (ctx) => ctx.reply('Welcome, please read the pinned message'))
bot.hears('🔍 Verification', (ctx) => ctx.reply('Please check the verification procedure in the pinned message'))
bot.hears('/verify', (ctx) => ctx.reply('Please check the verification procedure in the pinned message'))
bot.hears('Verify', (ctx) => ctx.reply('Please check the verification procedure in the pinned message'))
bot.hears('verify', (ctx) => ctx.reply('Please check the verification procedure in the pinned message'))


bot.on('message', (ctx) => { 
   try{
   const userId = ctx.message.from.id;
   let command = ctx.message.text;
   let user = ctx.message.from.username;


   if(state[userId].command=='🔑 New password'){
      const newpassword = ctx.message.text;
      ctx.reply(`resetting password to ${newpassword}`);
      const params = {username: ctx.message.from.username};

      console.log(params);

      User.findOne( params, (err, user)=> {

         if(user) {
            user.password = newpassword;
            user.save((err)=>{

               if(!err && ctx.message.chat.type=="private") {

                  ctx.telegram.sendMessage(ctx.message.chat.id, 'your password has been reset');
               }
            });

            

         }
      });
   
      state[userId].command='';
      ctx.reply('keyboard enabled', 
   
      Markup
      .keyboard([
        ['🔍 Verification', '🔑 New password'], // Row1 with 2 buttons
        ['📊 myomnisbit', '👥 myreferrals'], // Row2 with 2 buttons
        ['📢 Task', '⭐️ Airdrop', '👜 Add wallet'], // Row3 with 3 buttons
        
      ])
      .oneTime()
      .resize()
      .extra()
      
      
      )
   }
   if(state[userId].command=='🔍 Verification'){
      const code = ctx.message.text;
      const params = {username: ctx.message.from.username, userverify: code};

      console.log(params);

      User.findOne( params, (err, user)=> {

         if(user) {
            if(user.emailverify=='')
            {
            user.botverify = '';
            user.userverify='';
            }else
            {
               user.botverify='';
            }
            user.save((err)=>{

               if(!err && ctx.message.chat.type=="private") {

                  ctx.telegram.sendMessage(ctx.message.chat.id, 'code verified, your account is activated now');
               }
            });

            

         }
      });
      state[userId].command='';
      ctx.reply('keyboard enabled', 
   
      Markup
      .keyboard([
        ['🔍 Verification', '🔑 New password'], // Row1 with 2 buttons
        ['📊 myomnisbit', '👥 myreferrals'], // Row2 with 2 buttons
        ['📢 Task', '⭐️ Airdrop', '👜 Add wallet'], // Row3 with 3 buttons
        
      ])
      .oneTime()
      .resize()
      .extra()
      
      
      )
   }
  
}catch(err){
   console.log(err);
}
   
   
  





//     if (adminsList.indexOf(user) > -1) {

//       //check for the points of user

//       console.log("message from admin .. verifying score ");
//       console.log(ctx.message.text);

//       if(ctx.message.reply_to_message){

//          const groupuser = ctx.message.reply_to_message.from.username;

//          User.findOne({username: groupuser, userverify: ""}, (err,user)=>{

//             if(user) {

//                // if(command.trim() =='👍') {

//                //    user.commentScore += 1;
//                //    user.omnisbitScore += 1;

//                // }   
                  
//                // if(command.trim() =='🔝') {
//                //    user.commentScore += 5;
//                //    user.omnisbitScore += 5;

//                // }  
      
//                // if(command.trim() =='👎') {
//                //    if(user.commentScore>1) {
//                //       user.commentScore -= 1;
//                //       user.omnisbitScore -= 1;

//                //    }
//                // }  


//                // if(command.trim() =='🤦‍♂️') {
//                //    if(user.commentScore>5 ){
//                //       user.commentScore -= 5;
//                //       user.omnisbitScore -= 5;

//                //    }
//                // }  



//                let count,alter=0;

//                count = (command.match(new RegExp('👍', "g")) || []).length; 
//                alter += count * 1;

//                count = (command.match(new RegExp('🔝', "g")) || []).length; 
//                alter += count * 5;

//                count = (command.match(new RegExp('👎', "g")) || []).length; 
//                alter += count * -1;

//                count = (command.match(new RegExp('🤦‍♂', "g")) || []).length; 
//                alter += count * -5;

//                var om=alter;
//                user.commentScore += alter;
//                user.omnisbitScore += alter;
// 			      User.findOne({email: user.referrer}, (err,usr) =>
//                {
//                   const historylist= new History();
//                   historylist.email=usr.email;
//                   historylist.title="Refferal Reward via Bot";
//                   historylist.EarnOmnis=om * 0.2;
//                   historylist.historyDate=Date.now();
//                   historylist.save();
                  
//                    usr.omnisbitScore+= om * 0.2;
//                    usr.save();
//                });
//                const histlist= new History();
//                histlist.email=user.email;
//                histlist.title="Reward via Bot";
//                histlist.EarnOmnis=om;
//                histlist.historyDate=Date.now();
//                histlist.save();
               

//                alter = 0;

//                count = (command.match(new RegExp('👌', "g")) || []).length; 
//                alter += count * 1;

//                count = (command.match(new RegExp('🤝', "g")) || []).length; 
//                alter += count * 10;

//                user.commentScore += alter;



//                user.save();


//             } else {
//                console.log("User not found")
//             }


   
   


//          });

//       }
      
//       // console.log('looking for verification ',verify)
      

//       var message_text = command?command.split(/\r?\n/).join(' '):'';

//       let banCommand = message_text.match(/\s*(\/ban)\s+(\w+)/i)
//       // console.log('looking for verification ',verify)
//       if(banCommand) {
//          const entity = banCommand[2];

//          let ban = new Ban();
//          ban.entity = entity;

//          ban.save((err)=>{
//             if(!err && ctx.message.chat.type=="private") {

//                let isEmail = entity.trim().match(/^\S+@\S+$/)
//                if(isEmail) {
//                   User.remove({email:entity}, (err)=>{console.log(err)});
//                } else {
//                   User.remove({username:entity}, (err)=>{console.log(err)});
//                }


//                ctx.telegram.sendMessage(ctx.message.chat.id, ` ${entity} is banned now`);
//             }
//          })

   
//       }

//       let unbanCommand = message_text.match(/\s*(\/unban)\s+(\w+)/i)
//       // console.log('looking for verification ',verify)
//       if(unbanCommand) {
//          const entity = unbanCommand[2];


//          Ban.remove({entity:entity}, (err)=>{
//             if(!err && ctx.message.chat.type=="private") {

//                ctx.telegram.sendMessage(ctx.message.chat.id, ` ${entity} is unbanned now`);
//             }
//          })

   
//       }


//       let banStatus = message_text.match(/\s*(\/banStatus)\s+(\w+)/i)
//       // console.log('looking for verification ',verify)
//       if(banStatus) {
//          const entity = banStatus[2];


//          Ban.findOne({entity:entity}, (err,ban)=>{
//             if(!err && ctx.message.chat.type=="private") {
//                if(ban) {
//                   ctx.telegram.sendMessage(ctx.message.chat.id, ` ${entity} is banned`);
//                } else {
//                   ctx.telegram.sendMessage(ctx.message.chat.id, ` ${entity} is not in banned list`);

//                }

//             }
//          })

   
//       }


//    } else {
//       //Not in the array
  
  

  
//    var message_text = command?command.split(/\r?\n/).join(' '):'';

//     console.log(`${user} : ${message_text}`);

// if(!message_text) {

//   // console.log(JSON.stringify(ctx.message));
//   return;
// }

//    for(var i =0;i< banned_patterns.length; i++) {
   
//    var pattern = banned_patterns[i];


//    var match_value = pattern.test(message_text);
   
//       console.log(pattern, match_value);


//    if(match_value){
//      console.log("Found banned");
//      //ctx.deleteMessage();
//     ctx.tg.deleteMessage(ctx.chat.id, ctx.message.message_id);
//    //  ctx.telegram.sendMessage(ctx.message.chat.id,"Deleted message");

//    } else {
      
//       console.log("Allowed" , JSON.stringify(ctx.message) );



//    }
   
//    }

//    let verify = message_text.match(/\s*(\/verify)\s+(\w+)/i)
//    // console.log('looking for verification ',verify)
//    if(verify) {
//       const code = verify[2];
//       const params = {username: ctx.message.from.username, userverify: code};

//       console.log(params);

//       User.findOne( params, (err, user)=> {

//          if(user) {
//             if(user.emailverify=='')
//             {
//             user.botverify = '';
//             user.userverify='';
//             }else
//             {
//                user.botverify='';
//             }
//             user.save((err)=>{

//                if(!err && ctx.message.chat.type=="private") {

//                   ctx.telegram.sendMessage(ctx.message.chat.id, 'code verified, your account is activated now');
//                }
//             });

            

//          }
//       });

//    }

//    let resetpassword = message_text.match(/\s*(\/newpassword)\s+(\w+)/i)

//    if(resetpassword) {
//       const newpassword = resetpassword[2];
//       console.log(`resetting password to ${newpassword}`);
//       const params = {username: ctx.message.from.username};

//       console.log(params);

//       User.findOne( params, (err, user)=> {

//          if(user) {
//             user.password = newpassword;
//             user.save((err)=>{

//                if(!err && ctx.message.chat.type=="private") {

//                   ctx.telegram.sendMessage(ctx.message.chat.id, 'your password has been reset');
//                }
//             });

            

//          }
//       });

//    }


//    let fetchrank = message_text.match(/^\s*(\/myrank)\s*$/i)

//    if(fetchrank) {

//       const params = {username: ctx.message.from.username};

//       console.log(params);

//       User.findOne( params, (err, user)=> {

//          if(user) {


//                if(!err && ctx.message.chat.type=="private") {
//                   const rank = user.commentScore || 0;
//                   ctx.telegram.sendMessage(ctx.message.chat.id, `Your rank is ${rank} .`);
//                }
            

//          }
//       });

//    }


//    let fetchreferrals = message_text.match(/^\s*(\🔍 myreferrals)\s*$/i)

//    if(fetchreferrals) {

//       const params = {username: ctx.message.from.username};

//       console.log(params);

//       User.findOne( params, (err, user)=> {

//          if(user) {


//                if(!err && ctx.message.chat.type=="private") {
//                   const referrals = user.referralScore || 0;
//                   ctx.telegram.sendMessage(ctx.message.chat.id, `Your Referral score is ${referrals} .`);
//                }
            

//          }
//       });

//    }


//    let fetchomnis = message_text.match(/^\s*(\☸ myomnisbit)\s*$/i)

//    if(fetchomnis) {

//       const params = {username: ctx.message.from.username};

//       console.log(params);

//       User.findOne( params, (err, user)=> {

//          if(user) {


//                if(!err && ctx.message.chat.type=="private") {
//                   const omnis = user.omnisbitScore || 0;
//                   ctx.telegram.sendMessage(ctx.message.chat.id, `Your OmnisBit score is ${omnis} .`);
//                }
            

//          }
//       });

//    }


// }


});


const hook = '/bothook';
const server_name='www.cryptohunters.club';

bot.startPolling();

// const webhook_path = `https://${server_name}${hook}`;
// console.log(webhook_path);


// bot.telegram.deleteWebhook(hook);

// bot.telegram.setWebhook(webhook_path);

// module.exports = bot.webhookCallback(hook);


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

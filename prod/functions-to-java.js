var jsToJava = {}

//close app
jsToJava.closeApp = function (){
    if(!jsToJava.ispro){
        try{
            Android.closeApp();
        }catch(e){
            console.log(e)
        }
    }else{
        console.log("App is Pro")
    }
}

//Show banner ad
jsToJava.showBanner = function (){
    if(!jsToJava.ispro){
        try{
            Android.showAndroidBanner()
        }catch(e){
            console.log(e)
        }
    }else{
        console.log("App is Pro")
    }
}

//Hide banner ad
jsToJava.hideBanner = function (){
	try{
		Android.hideAndroidBanner()
	}catch(e){
		console.log(e)
	}
}

//Show interstitial ad
jsToJava.showInterstitial = function (){
    if(!jsToJava.ispro){
        try{
            Android.showAd()
        }catch(e){
            console.log(e)
        }
    }else{
        console.log("App is Pro")
    }
}

jsToJava.showRewardedAd = function(){
    if(!jsToJava.ispro){
        try{
            Android.showRewardedAd()
        }catch(e){
            console.log(e)
        }
    }else{
        console.log("App is Pro")
    }
}

//User got reward from rewarded ad
jsToJava.rewarded = function(){
    //Modify this as you need
    document.getElementById("currentrewards").innerHTML = "Got ad Reward!"
}

//Landscape screen
jsToJava.landscape = function (){
	try{
		Android.landscape()
	}catch(e){
		console.log(e)
	}
}

//Portrait screen
jsToJava.portrait = function (){
	try{
		Android.portrait()
	}catch(e){
		console.log(e)
	}
}

//Show toast alert
jsToJava.alert = function(txt){
    try{
        Android.showAlert(txt)
    }catch(e){
        console.log(e)
    }
}

//Rate this app
jsToJava.rateThisApp = function(){
    try{
        Android.rateThisApp()
    }catch(e){
        console.log(e)
    }
}

//Share a text
jsToJava.shareText = function(txt, title){
    try{
        Android.shareText(txt, title)
    }catch(e){
        console.log(e)
    }
}

//Share this app
jsToJava.shareThisApp = function(txt, title){
    try{
        Android.shareThisApp(txt, title)
    }catch(e){
        console.log(e)
    }
}

//Purchase Remove Ads feature
jsToJava.removeAds = function(){
    try{
        Android.removeAds()
    }catch(e){
        console.log(e)
    }
}

//Determine the app is it pro without ads or not
jsToJava.ispro = false
jsToJava.itspro = function(n){
    if(n == 1){
        jsToJava.hideBanner()
        jsToJava.ispro = true
    }else{
        jsToJava.ispro = false
    }
}
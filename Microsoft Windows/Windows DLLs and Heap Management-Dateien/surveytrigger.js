if(!window.MS){MS={};}if(!MS.Support){MS.Support={};}if(!MS.Support.Fms){MS.Support.Fms={};}if(!MS.Support.Fms.Gsfx){MS.Support.Fms.Gsfx={};}if(!MS.Support.Fms.Gsfx.SurveyTrigger){MS.Support.Fms.Gsfx.SurveyTrigger=function(){var animationFPS=24;var stduration=Math.round(1000*(1/animationFPS));if(!animationDuration){var animationDuration=0.5;}var frameCount=animationDuration * animationFPS;var movementPX=false;var surveyHeight;var surveyWidth;var surveyObj;var fixedPosition=false;var documentElement=null;function checkFrequency(){return(!isNaN(Freq))&&(Freq>0)&&(Math.floor(Math.random()* Freq)==0);}function isTriggerSuppressed(id){var triggers=MS.Support.Fms.CookieUtil.getSubCookie('fmsmemo','st');if((triggers+'|').indexOf('|'+id+'|')>-1)return true;return false;}function suppressTriggger(id){var triggers=MS.Support.Fms.CookieUtil.getSubCookie('fmsmemo','st');triggers+='|'+id;MS.Support.Fms.CookieUtil.setSubCookie('fmsmemo','st',triggers);}









this.triggerInit=function(mode){


if(isDomainTracking()||(IntervalType=='session'&&isTriggerSuppressed(TriggerId))){return false;}var isFollowUp=IntervalType=='followup' ? true: false;if(isFollowUp){var followupCookieKey="fmsfollowups"+CookieDef;if(MS.Support.Fms.CookieUtil.getCookie(followupCookieKey)=="blank"){
return false;}else if(mode==0||mode==2){
MS.Support.Fms.CookieUtil.setCookie(followupCookieKey,"",-1);}}var MiliDay=86400000;var maturity=0;var curDate=new Date();var visits=fetchcookieval(CookieDef);var parts=visits.split('_');var ret;if(null==visits||parts.length!=3||isNaN(parts[0])){setcookieval(CookieDef,'1_0_0');parts=["0","0","0"];}var origDate=parseInt(parts[1]);visits=parseInt(parts[0]);if((!(mode==0||mode==1)||checkFrequency())&&(visits>=maturity)&&(isFollowUp||fmsSurveyExpired(Exp))
){if(mode==0||mode==2)
setcookieval(CookieDef,visits+1+'_'+curDate.getTime()/MiliDay+'_'+Exp);ret=true;}else{if(mode==0||mode==2)
setcookieval(CookieDef,visits+1+'_'+parts[1]+'_'+parts[2]);ret=false;}if(!ret&&IntervalType=='session')
suppressTriggger(TriggerId);return ret;};this.fireTrigger=function(SurveyURL){var sSiteID='',sTheme='',sTool='',sSiteRegionID='',sReferringURL='',P0='',P1='',P2='',P3='',P4='',P5='',P6='',P7='',P8='',P9='';var fta=arguments;var l=fta.length;if(l>1)sSiteID=fta[1];if(l>2)sTheme=fta[2];if(l>3)sTool=fta[3];if(l>4)sSiteRegionID=fta[4];if(l>5)sReferringURL=fta[5];if(l>6)P0=fta[6];if(l>7)P1=fta[7];if(l>8)P2=fta[8];if(l>9)P3=fta[9];if(l>10)P4=fta[10];if(l>11)P5=fta[11];if(l>14)P8=fta[14];if(l>15)P9=fta[15];var fullURL=SurveyURL+'&site='+sSiteID+'&tool='+sTool+'&theme='+sTheme+'&sd='+sSiteID+'&SurveyStyle='+SurveyStyle+'&siteregion='+sSiteRegionID+'&url='+sReferringURL+'&p0='+P0+'&p1='+P1+'&p2='+P2+'&p3='+P3+'&p4='+P4+'&p5='+P5+'&p6='+P6+'&p7='+P7+'&p8='+P8+'&p9='+P9;
fullURL+='&ct='+StatsDotNet.contentType;fullURL+='&cc='+StatsDotNet.ContentCulture;fullURL+='&cid='+StatsDotNet.contentId;fullURL+='&clcid='+StatsDotNet.contentLn;fullURL+='&sc='+StatsDotNet.SiteCulture;fullURL+='&sbid='+StatsDotNet.siteBrandId;fullURL+='&ssid='+StatsDotNet.ssId;fullURL+='&ssver='+StatsDotNet.SsVersion;fullURL+='&cp='+OutputEncoder_EncodeUrl(StatsDotNet.ContentProperties);fullURL+='&trigger='+TriggerId;if(EmailStyle==1)
fullURL=fullURL+'&emailsurveyid='+EmailSurveyID+'&sessionid=-1';if(DisplayIntroPage!='1')
fullURL=fullURL+'&showpage=1';if(SurveyStyle==null)
SurveyStyle="popup";SurveyStyle=SurveyStyle.toLowerCase();if(SurveyStyle=="embedded"){if(embedSurveyPrompt=='nothing')
window.location.href=fullURL;else{if(embedSurveyPrompt!=""&&window.screenTop<10000&&window.confirm(embedSurveyPrompt)==true){

document.writeln('<html><body>');document.writeln('<form name="the_form" action="'+fullURL+'" method="post"><\/form>');document.writeln("<\/body><\/html>");document.the_form.submit();}}}else{fullURL=fullURL.toLowerCase().replace("survey.aspx","surveyinvite.aspx");if(DisplayIntroPage=='1')
fullURL=fullURL+'&showpage=1';
if(document.location.href.toLowerCase().indexOf('fr=1')>0)
fullURL=fullURL+'&fr=1';if(TrEvent=='onunload')
fullURL=fullURL+'&onunload=1';fireSurvey(fullURL);}};function fireSurvey(fullURL){presentSurvey(fullURL);}function surveyDiv(fullURL){var sd=document.createElement("div");sd.id="surveyDivBlock";sd.className="surveyInvitationDiv";var si=document.createElement("iframe");si.scrolling='no';si.frameBorder=0;si.src=fullURL;sd.appendChild(si);return sd;}function hI(name,value){var inp=document.createElement("input");inp.type="hidden";inp.name=name;inp.value=value;return inp;}function declineSurvey(el){while(el.className!="surveyInvitationDiv")el=el.parentNode;el.parentNode.removeChild(el);}function closeEnough(int1,int2){if(Math.abs(int1-int2)<=movementPX)return true;return false;}function calcXY(current,target){if(!closeEnough(current,target)){var delta=current - target;var dir=delta / Math.abs(delta);return current - movementPX*dir;}return false;}function isRTL(){if((!fixedPosition)&&documentElement.currentStyle&&documentElement.currentStyle.blockDirection=="rtl"){return true;}else{return false;}}function getFrameX(){var x=parseInt(isRTL()? surveyObj.style.right : surveyObj.style.left);return isNaN(x)? 0 : x;}function getFrameY(){var y=parseInt(surveyObj.style.top);return isNaN(y)? 0 : y;}function getTargetFrameX(){return getWindowCenterX()- surveyWidth / 2;}function getTargetFrameY(){return getWindowCenterY()- surveyHeight / 2;}function setFrameX(x){if(isRTL()){surveyObj.style.right=x;}else{surveyObj.style.left=x;}}function setFrameY(y){surveyObj.style.top=y;}function moveFrameTo(x,y){setFrameX(x);setFrameY(y);}function getScrollX(){if(!fixedPosition){if(isRTL()){return(documentElement.scrollWidth - documentElement.clientWidth - documentElement.scrollLeft);}else{return documentElement.scrollLeft;}}else{return 0;}}function getScrollY(){return(!fixedPosition)? documentElement.scrollTop : 0;}function getWindowCenterX(){return Math.round(fbp(window.innerWidth,documentElement.clientWidth)/ 2+getScrollX());}function getWindowCenterY(){return Math.round(fbp(window.innerHeight,documentElement.clientHeight)/ 2+getScrollY());}function animateSurvey(){calcFPS();var x=calcXY(getFrameX(),getTargetFrameX());var y=calcXY(getFrameY(),getTargetFrameY());if(x!=false||y!=false){if(x!=false){setFrameX(x);}if(y!=false){setFrameY(y);}setTimeout(animateSurvey,stduration);}}function getPositionDeltaX(){return Math.abs(getTargetFrameX()- getFrameX());}function getPositionDeltaY(){return Math.abs(getTargetFrameY()- getFrameY());}function fbp(p1,p2){if(!p1||p1<1){return p2;}return p1;}function calcFPS(){var x=getPositionDeltaX();var y=getPositionDeltaY();if(y>x)x=y;movementPX=Math.ceil(x / frameCount);}window.placeSurvey=function(){surveyWidth=fbp(surveyObj.clientWidth,surveyObj.offsetWidth);surveyHeight=fbp(surveyObj.clientHeight,surveyObj.offsetHeight);setFrameX(getTargetFrameX());surveyObj.style.top=0;surveyObj.style.visibility="visible";if(window.attachEvent){window.attachEvent("onresize",animateSurvey);window.attachEvent("onscroll",animateSurvey);}else if(window.addEventListener){window.addEventListener("resize",animateSurvey,false);surveyObj.style.position="fixed";fixedPosition=true;}animateSurvey();};function presentSurvey(fullURL){documentElement=document.body ? document.body : document.documentElement;if(documentElement){surveyObj=surveyDiv(fullURL);documentElement.appendChild(surveyObj);}}};}